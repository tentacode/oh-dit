<?php

declare(strict_types=1);

namespace App\Features\Authentication\Controller;

use App\Features\Authentication\Command\SendRegistrationLinkCommand;
use App\Features\Authentication\Entity\User;
use App\Infrastructure\Symfony\Controller\ApiController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;

class SendRegisterConfirmationLinkRequest
{
    public function __construct(
        #[Assert\NotBlank(message: "L'email est obligatoire.")]
        #[Assert\Email(message: "L'email n'est pas valide.")]
        public string $email,
    ) {
    }
}

class SendRegisterConfirmationLinkController extends ApiController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly SendRegistrationLinkCommand $sendRegistrationLinkCommand,
    ) {
    }

    #[Route('/api/register/send-confirmation-link', name: 'register_send_confirmation_link', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload()]
        SendRegisterConfirmationLinkRequest $sendRegisterConfirmationLinkRequest,
    ): JsonResponse {
        $user = $this->entityManager
            ->getRepository(User::class)
            ->findOneByEmail($sendRegisterConfirmationLinkRequest->email);

        if ($user) {
            // If the user already exists, still sending a proper response
            // to avoid revealing whether the email is registered or not.
            return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
        }

        ($this->sendRegistrationLinkCommand)($sendRegisterConfirmationLinkRequest->email);

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }
}
