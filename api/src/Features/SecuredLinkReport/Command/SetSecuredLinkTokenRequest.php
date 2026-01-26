<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Command;

use Symfony\Component\Validator\Constraints as Assert;

final class SetSecuredLinkTokenRequest
{
    public function __construct(
        #[Assert\Length(min: 12, minMessage: 'Le mot de passe doit contenir au moins {{ limit }} caractères.')]
        #[Assert\NotBlank(message: 'Le mot de passe est obligatoire.')]
        #[Assert\Regex('/\d/', message: 'Le mot de passe doit contenir au moins un chiffre.')]
        #[Assert\Regex('/[A-Z]/', message: 'Le mot de passe doit contenir au moins une lettre majuscule.')]
        #[Assert\Regex('/[\W_]/', message: 'Le mot de passe doit contenir au moins un caractère spécial.')]
        public readonly ?string $password,
    ) {
    }
}
