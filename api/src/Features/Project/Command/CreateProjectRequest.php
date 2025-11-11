<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateProjectRequest
{
    #[Assert\NotBlank(message: 'Le nom du projet est obligatoire.')]
    #[Assert\Type('string')]
    #[Assert\Length(max: 255)]
    public string $name;

    /**
     * @var array<int, string>
     */
    #[Assert\Count(min: 1, minMessage: 'Au moins une page est requise.')]
    #[Assert\All([
        new Assert\Type('string'),
        new Assert\NotBlank(message: 'Le nom de la page ne peut pas être vide.'),
        new Assert\Length(max: 180, maxMessage: 'Le nom de la page ne peut pas dépasser 180 caractères.'),
    ])]
    public array $screens;
}
