<?php

declare(strict_types=1);

namespace App\Features\Authentication\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Infrastructure\Symfony\Controller\ApiController;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;

class ResetPasswordRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Le token est obligatoire.')]
        public string $token,
        #[Assert\NotBlank(message: 'Le nouveau mot de passe est obligatoire.')]
        #[Assert\Length(min: 8, minMessage: 'Le nouveau mot de passe doit contenir au moins {{ limit }} caractères.')]
        public string $newPassword,
    ) {
    }
}

class ResetPasswordController extends ApiController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly ValidateOrThrowApiErrorCommand $validateOrThrow,
        private readonly JWTTokenManagerInterface $jwtManager,
    ) {
    }

    #[Route('/api/reset_password', name: 'reset_password', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload()]
        ResetPasswordRequest $resetPasswordRequest,
    ): JsonResponse {
        $user = $this->entityManager
            ->getRepository(User::class)
            ->findOneBy([
                'passwordResetToken' => $resetPasswordRequest->token,
            ]);
        if (! $user instanceof User) {
            captureException(new SuspiciousOperationException('User try to reset password with invalid token.'));

            throw new NotFoundHttpException('No user found with the given token.');
        }

        $user->setHashedPassword(
            $this->passwordHasher->hashPassword(
                $user,
                $resetPasswordRequest->newPassword,
            ),
        );

        // This will also validate if the token is expired
        ($this->validateOrThrow)($user);

        $user->clearResetToken();

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse([
            'token' => $this->jwtManager->create($user),
        ], JsonResponse::HTTP_OK);
    }
}
