<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use Symfony\Component\Serializer\Attribute\Context;
use Symfony\Component\Serializer\Normalizer\ArrayDenormalizer;
use Symfony\Component\Validator\Constraints as Assert;

final class CreateProjectRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'L\'UUID de l\'équipe est obligatoire.')]
        #[Assert\Uuid(message: 'L\'UUID de l\'équipe doit être un UUID valide.')]
        public readonly string $teamUuid,

        #[Assert\NotBlank(message: 'Le nom du projet est obligatoire.')]
        #[Assert\Type('string')]
        #[Assert\Length(max: 255)]
        public readonly string $name,

        #[Assert\Type('string')]
        public readonly string $url,

        #[Assert\Count(min: 1, minMessage: 'Au moins une page est requise.')]
        #[Assert\All(
            new Assert\Collection(
                fields: [
                    'name' => [
                        new Assert\NotBlank(message: 'Le nom de la page est obligatoire.'),
                        new Assert\Length(max: 180, maxMessage: 'Le nom de la page ne peut pas dépasser 180 caractères.'),
                    ],
                    'url' => [
                        new Assert\Type('string'),
                    ],
                    'rank' => [
                        new Assert\NotBlank(message: 'Le rang de la page est obligatoire.'),
                        new Assert\Type('integer'),
                    ],
                ],
                allowExtraFields: false,
                allowMissingFields: false,
            )
        )]
        public readonly array $screens,
    ) {}
}
