<?php

declare(strict_types=1);

namespace App\Features\Recommandation\Command;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateRecommandationRequest
{
    #[Assert\NotBlank(message: 'L\'UUID de la règle est obligatoire.')]
    #[Assert\Uuid(message: 'L\'UUID de la règle doit être un UUID valide.')]
    public string $ruleUuid;

    #[Assert\NotBlank(message: "L'UUID du projet est obligatoire.")]
    #[Assert\Uuid(message: 'L\'UUID du projet doit être un UUID valide.')]
    public string $projectUuid;

    #[Assert\NotBlank(message: "L'UUID de la page est obligatoire.")]
    #[Assert\Uuid(message: 'L\'UUID de la page doit être un UUID valide.')]
    public string $screenUuid;

    #[Assert\NotBlank(message: 'La sévérité est obligatoire.')]
    #[Assert\Choice(choices: ['low', 'moderate', 'blocking'], message: 'La sévérité doit être "low", "moderate" ou "blocking".')]
    public string $severity;

    #[Assert\NotBlank(message: 'Le texte de la recommandation est obligatoire.')]
    public string $text;
}
