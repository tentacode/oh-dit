<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Security;

use Symfony\Component\Security\Core\User\UserInterface;

final class SecuredLinkUser implements UserInterface
{
    public function __construct(
        private readonly string $securedLinkToken,
    ) {
    }

    public function getEmail(): string
    {
        return '';
    }

    public function getRoles(): array
    {
        return ['ROLE_SECURED_LINK_ACCESS'];
    }

    public function getUserIdentifier(): string
    {
        return 'secured_link_' . $this->securedLinkToken;
    }

    public function getSecuredLinkToken(): string
    {
        return $this->securedLinkToken;
    }

    public function eraseCredentials(): void
    {
    }
}
