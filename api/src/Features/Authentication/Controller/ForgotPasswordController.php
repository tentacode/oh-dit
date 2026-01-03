<?php

declare(strict_types=1);

namespace App\Features\Authentication\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Infrastructure\Symfony\Controller\ApiController;
use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\SendSmtpEmail;
use Doctrine\ORM\EntityManagerInterface;
use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Webmozart\Assert\Assert as WebmozartAssert;

class ForgotPasswordRequest
{
    public function __construct(
        #[Assert\NotBlank(message: "L'email est obligatoire.")]
        #[Assert\Email(message: 'L\'email doit être une adresse email valide.')]
        public ?string $email,
    ) {
    }
}

class ForgotPasswordController extends ApiController
{
    public const FORGOT_PASSWORD_TEMPLATE_ID = 10;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/api/forgot_password', name: 'forgot_password', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload()]
        ForgotPasswordRequest $forgotPasswordRequest,
    ): JsonResponse {
        $user = $this->entityManager
            ->getRepository(User::class)
            ->findOneByEmail($forgotPasswordRequest->email);

        if (! $user) {
            captureException(new SuspiciousOperationException('No user found with the given email address.'));

            // To prevent user enumeration, always return a successful response
            usleep(mt_rand(500000, 1000000)); // Artificial delay
            return new JsonResponse([], JsonResponse::HTTP_OK);
        }

        $user->setRandomPasswordResetToken();
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        WebmozartAssert::string($_SERVER['FRONTEND_APP_HOST'], 'FRONTEND_APP_HOST is not set in server variables.');

        $resetPasswordUrl = sprintf(
            '%s/reset-mot-de-passe?token=%s',
            rtrim($_SERVER['FRONTEND_APP_HOST'], '/'),
            $user->getPasswordResetToken()
        );

        $responseData = in_array($_SERVER['APP_ENV'], ['dev', 'test'], true) ? [
            'reset_password_url' => $resetPasswordUrl,
            'token' => $user->getPasswordResetToken(),
        ] : [];

        $this->sendResetEmail($user, $resetPasswordUrl);

        return new JsonResponse($responseData, JsonResponse::HTTP_OK);
    }

    private function sendResetEmail(User $user, string $resetPasswordUrl): void
    {
        if ($_ENV['BREVO_API_KEY'] === 'SKIP_BREVO_IN_DEV') {
            // Skip sending email in dev environment
            return;
        }

        WebmozartAssert::notEmpty($_ENV['BREVO_API_KEY'], 'Brevo API key is not set in environment variables.');
        WebmozartAssert::notEq($_ENV['BREVO_API_KEY'], 'CHANGE_ME', 'You still have CHANGE_ME in your .env file for the Brevo API key.');
        WebmozartAssert::string($_ENV['BREVO_API_KEY'], 'Brevo API key must be a string.');

        $brevoConfig = Configuration::getDefaultConfiguration()
            ->setApiKey('api-key', $_ENV['BREVO_API_KEY']);

        $sendSmtpEmail = new SendSmtpEmail([
            'to' => [
                [
                    'email' => $user->getEmail(),
                ],
            ],
            'templateId' => self::FORGOT_PASSWORD_TEMPLATE_ID,
            'params' => [
                'reset_password_url' => $resetPasswordUrl,
            ],
        ]);

        $transactionalEmailsApi = new TransactionalEmailsApi(
            new Client(),
            $brevoConfig
        );

        $transactionalEmailsApi->sendTransacEmail($sendSmtpEmail);
    }
}
