<?php

declare(strict_types=1);

namespace App\Features\Newsletter\Command;

use Symfony\Component\Validator\Constraints as Assert;

readonly class BrevoNewsletter
{
    public function __construct(
        #[Assert\Email(message: "L'adresse email {{ value }} n'est pas valide.")]
        #[Assert\NotBlank(message: 'Vous devez renseigner une adresse email.')]
        public string $email,
        #[Assert\Expression(
            expression: 'this.atLeastOneConsent()',
            message: "Choisissez au moins une des options de la newsletter pour que l'on puisse vous contacter.",
        )]
        public bool $consentBeta,
        public bool $consentNewsletter,
        public bool $consentBlog,
    ) {
    }

    public function atLeastOneConsent(): bool
    {
        return $this->consentNewsletter || $this->consentBlog || $this->consentBeta;
    }
}
