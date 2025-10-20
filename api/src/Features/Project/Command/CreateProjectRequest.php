<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use Symfony\Component\Validator\Constraints as Assert;

final class CreateProjectRequest
{
    #[Assert\NotBlank(message: 'Project name is required')]
    #[Assert\Type('string')]
    #[Assert\Length(max: 255)]
    public string $name;
}
