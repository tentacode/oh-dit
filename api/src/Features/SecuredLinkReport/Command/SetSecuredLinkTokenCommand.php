<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Command;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Uid\Uuid;
use Webmozart\Assert\Assert;

final class SetSecuredLinkTokenCommand
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(
        User $user,
        Project $project,
        SetSecuredLinkTokenRequest $securedLinkTokenRequest
    ): string {
        if ($user->isInTeam($project->getTeam()) === false) {
            throw new SuspiciousOperationException("User is trying to set a secured link to a project they don't own.");
        }

        Assert::notNull($securedLinkTokenRequest->password);

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $securedLinkTokenRequest->password,
        );

        $token = Uuid::v4()->toRfc4122();

        $project->setSecuredLink(
            token: $token,
            hashedPassword: $hashedPassword
        );

        $this->entityManager->persist($project);
        $this->entityManager->flush();

        return $token;
    }
}
