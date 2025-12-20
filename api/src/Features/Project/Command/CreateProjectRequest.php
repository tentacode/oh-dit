<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateScreenRequest
{
    #[Assert\NotBlank(message: 'Le nom de la page est obligatoire.')]
    #[Assert\Type('string')]
    #[Assert\Length(max: 180, maxMessage: 'Le nom de la page ne peut pas dépasser 180 caractères.')]
    public string $name;

    #[Assert\Type('string')]
    public string $url;

    #[Assert\Type('integer')]
    #[Assert\NotBlank(message: 'Le rang de la page est obligatoire.')]
    public int $rank;
}

final class CreateProjectRequest
{
    #[Assert\NotBlank(message: 'L\'UUID de l\'équipe est obligatoire.')]
    #[Assert\Uuid(message: 'L\'UUID de l\'équipe doit être un UUID valide.')]
    public string $teamUuid;

    #[Assert\NotBlank(message: 'Le nom du projet est obligatoire.')]
    #[Assert\Type('string')]
    #[Assert\Length(max: 255)]
    public string $name;

    #[Assert\Type('string')]
    public string $url;

    /**
     * @var array<int, CreateScreenRequest>
     */
    #[Assert\Count(min: 1, minMessage: 'Au moins une page est requise.')]
    #[Assert\All([
        new Assert\Type(CreateScreenRequest::class),
    ])]
    #[Assert\Valid]
    public array $screens;
}
