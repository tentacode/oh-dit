<?php

declare(strict_types=1);

namespace App\Features\Authentication\EventListener;

use App\Features\Authentication\Entity\User;
use Carbon\CarbonImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class UserActivityListener
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $em
    ) {
    }

    #[AsEventListener(event: KernelEvents::REQUEST, priority: -10)]
    public function onKernelRequest(RequestEvent $event): void
    {
        if (! $event->isMainRequest()) {
            return;
        }

        $user = $this->security->getUser();

        if (! $user instanceof User) {
            return;
        }

        $this->updateUserActivity($user);
    }

    #[AsEventListener(event: 'lexik_jwt_authentication.on_authentication_success')]
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event): void
    {
        $user = $event->getUser();

        if (! $user instanceof User) {
            return;
        }

        $this->updateUserActivity($user);
    }

    private function updateUserActivity(User $user): void
    {
        $lastUpdate = CarbonImmutable::instance($user->getUpdatedAt());
        if ($lastUpdate->diffInMinutes() < 5) {
            return;
        }

        $this->em->getConnection()->executeStatement(
            'UPDATE "user" SET updated_at = NOW() WHERE uuid = :uuid',
            [
                'uuid' => $user->getUuid(),
            ]
        );
    }
}
