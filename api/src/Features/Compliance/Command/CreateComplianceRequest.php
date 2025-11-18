<?php

declare(strict_types=1);

namespace App\Features\Compliance\Command;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateComplianceRequest
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

    #[Assert\NotBlank(message: 'Le statut est obligatoire.')]
    #[Assert\Choice(choices: ['compliant', 'non_compliant', 'not_applicable'], message: 'Le statut doit être "compliant", "non_compliant" ou "not_applicable".')]
    public string $status;
}
