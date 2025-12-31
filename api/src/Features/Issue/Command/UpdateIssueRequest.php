<?php

declare(strict_types=1);

namespace App\Features\Issue\Command;

use Symfony\Component\Validator\Constraints as Assert;

final class UpdateIssueRequest
{
    #[Assert\NotBlank(message: 'La sévérité est obligatoire.')]
    #[Assert\Choice(choices: ['low', 'moderate', 'blocking'], message: 'La sévérité doit être low, moderate ou blocking.')]
    public string $severity;

    #[Assert\NotBlank(message: 'La description de la recommandation est obligatoire.')]
    public string $text;

    #[Assert\NotBlank(message: 'Le statut est obligatoire.')]
    // #[Assert\Choice(choices: [Status::PENDING, Status::FIXED], message: 'Le statut doit être pending ou fixed.')]
    public string $status;
}
