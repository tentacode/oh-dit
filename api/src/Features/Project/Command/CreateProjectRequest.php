<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateProjectRequest
{
    /**
     * @param array<int, array{name: string, url: string|null, rank: int}> $screens
     */
    public function __construct(
        #[Assert\NotBlank(message: 'L\'UUID de l\'équipe est obligatoire.')]
        #[Assert\Uuid(message: 'L\'UUID de l\'équipe doit être un UUID valide.')]
        public readonly ?string $teamUuid,
        #[Assert\Length(max: 255)]
        #[Assert\NotBlank(message: 'Le nom du projet est obligatoire.')]
        public readonly ?string $name,
        public readonly string $url = '',
        #[Assert\NotBlank(message: 'Le référentiel est obligatoire.')]
        #[Assert\Uuid(message: 'Le référentiel doit être un UUID valide.')]
        public readonly ?string $ruleSetUuid = null,
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
        public readonly array $screens = [],
    ) {
    }
}
