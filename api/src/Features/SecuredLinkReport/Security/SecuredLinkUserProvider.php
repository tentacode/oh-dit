<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Security;

use LogicException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;

/**
 * @implements UserProviderInterface<UserInterface>
 */
final class SecuredLinkUserProvider implements UserProviderInterface
{
    public function refreshUser(UserInterface $user): UserInterface
    {
        return $user;
    }

    public function supportsClass(string $class): bool
    {
        return $class === SecuredLinkUser::class;
    }

    public function loadUserByIdentifier(string $identifier): UserInterface
    {
        // Not used - user is created by SecuredLinkAuthenticator
        throw new LogicException('This provider does not support loading users by identifier.');
    }
}
