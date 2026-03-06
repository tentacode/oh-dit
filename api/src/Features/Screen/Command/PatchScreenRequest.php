<?php

declare(strict_types=1);

namespace App\Features\Screen\Command;

use Symfony\Component\Validator\Constraints as Assert;

final class PatchScreenRequest
{
    public function __construct(
        #[Assert\Length(max: 255)]
        #[Assert\NotBlank(message: 'Le nom de la page est obligatoire.', allowNull: true)]
        public readonly ?string $name,
        public readonly ?string $url = null,
        #[Assert\Type('integer')]
        public readonly ?int $rank = null,
    ) {
    }
}
