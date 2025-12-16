<?php

declare(strict_types=1);

namespace App\Features\Authentication\Controller;

use function Safe\base64_decode;
use App\Features\Authentication\Entity\Team;
use App\Features\Authentication\Entity\User;
use App\Infrastructure\Symfony\Controller\ApiController;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Webmozart\Assert\Assert as WebmozartAssert;

class RegisterBetaRequest
{
    public function __construct(
        #[Assert\NotBlank]
        public string $token,
        #[Assert\NotBlank(message: 'Le mot de passe est obligatoire.')]
        #[Assert\Length(
            min: 8,
            minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.',
        )]
        public string $password,
        #[Assert\NotBlank(message: 'Le nom d\'utilisateur·ice est obligatoire.')]
        public string $username,
        #[Assert\NotBlank(message: 'Le nom de l\'équipe est obligatoire. Si vous n\'avez pas d\'équipe, vous pouvez en créer une avec un nom inventé comme "Les héro·ines de l\'audit".')]
        public string $teamName,
    ) {
    }
}

class RegisterBetaController extends ApiController
{
    public function __construct(
        private readonly ValidateOrThrowApiErrorCommand $validateOrThrow,
        private readonly EntityManagerInterface $entityManager,
        // encode passwrd
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    #[Route('/api/register/beta', name: 'register_beta', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload()]
        RegisterBetaRequest $registerBetaRequest,
    ): JsonResponse {
        $decodedEmail = $this->decodeToken($registerBetaRequest->token);

        $user = new User(
            email: $decodedEmail,
            plainPassword: $registerBetaRequest->password,
            username: $registerBetaRequest->username,
        );

        $user->setHashedPassword(
            $this->passwordHasher->hashPassword(
                $user,
                $registerBetaRequest->password,
            ),
        );

        ($this->validateOrThrow)($user);

        $team = new Team(
            name: $registerBetaRequest->teamName,
        );

        $team->addUser($user);

        ($this->validateOrThrow)($team);

        $this->entityManager->persist($team);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $this->entityManager->refresh($user);

        return $this->getSerializedJsonResponse($user, JsonResponse::HTTP_CREATED);
    }

    private function decodeToken(string $token): string
    {
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            throw new SuspiciousOperationException('Invalid token format.');
        }

        [$payload, $signature] = $parts;

        WebmozartAssert::string($_SERVER['APP_SECRET'], 'APP_SECRET is not set in server variables.');

        $expectedSignature = hash_hmac('sha256', $payload, $_SERVER['APP_SECRET']);

        if (! hash_equals($expectedSignature, $signature)) {
            throw new SuspiciousOperationException('Invalid token signature.');
        }

        return base64_decode($payload, true);
    }
}
