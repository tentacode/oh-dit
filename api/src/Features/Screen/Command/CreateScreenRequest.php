<?php

declare(strict_types=1);

namespace App\Features\Screen\Command;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateScreenRequest
{
    public function __construct(
        #[Assert\NotBlank(message: "L'UUID du projet est obligatoire.")]
        #[Assert\Uuid(message: 'L\'UUID du projet doit être un UUID valide.')]
        public readonly ?string $projectUuid,
        #[Assert\Length(max: 255)]
        #[Assert\NotBlank(message: 'Le nom de la page est obligatoire.')]
        public readonly ?string $name,
        public readonly string $url = '',
        #[Assert\NotBlank(message: 'Le rang de la page est obligatoire.')]
        #[Assert\Type('integer', message: "Le rang de la page n'est pas au bon format.")]
        public readonly ?int $rank = null,
    ) {
    }
}
