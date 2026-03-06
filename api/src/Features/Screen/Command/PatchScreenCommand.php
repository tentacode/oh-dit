<?php

declare(strict_types=1);

namespace App\Features\Screen\Command;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Screen;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;

final class PatchScreenCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidateOrThrowApiErrorCommand $validateOrThrow,
    ) {
    }

    public function __invoke(Screen $screen, User $user, PatchScreenRequest $patchScreenRequest): Screen
    {
        $team = $screen->getProject()->getTeam();
        if (! $user->isInTeam($team)) {
            throw new SuspiciousOperationException('User is trying to patch a project in a team they do not belong to.');
        }

        if ($patchScreenRequest->name !== null) {
            $screen->setName($patchScreenRequest->name);
        }

        if ($patchScreenRequest->url !== null) {
            $screen->setUrl($patchScreenRequest->url);
        }

        if ($patchScreenRequest->rank !== null) {
            $screen->setRank($patchScreenRequest->rank);
        }

        ($this->validateOrThrow)($screen);

        $this->entityManager->persist($screen);
        $this->entityManager->flush();

        return $screen;
    }
}
