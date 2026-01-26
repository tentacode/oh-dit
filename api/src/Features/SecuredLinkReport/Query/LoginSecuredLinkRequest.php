<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Query;

use Symfony\Component\Validator\Constraints as Assert;

final class LoginSecuredLinkRequest
{
    public function __construct(
        #[Assert\NotBlank]
        public readonly string $password,
    ) {
    }
}
