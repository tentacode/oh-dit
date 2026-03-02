<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use Symfony\Component\Validator\Constraints as Assert;

final class PatchProjectRequest
{
    public function __construct(
        #[Assert\Length(max: 255)]
        #[Assert\NotBlank(message: 'Le nom du projet est obligatoire.', allowNull: true)]
        public readonly ?string $name,
        public readonly ?string $url = null,
    ) {
    }
}
