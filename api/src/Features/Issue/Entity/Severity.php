<?php

declare(strict_types=1);

namespace App\Features\Issue\Entity;

enum Severity: string
{
    case LOW = 'low';
    case MODERATE = 'moderate';
    case BLOCKING = 'blocking';
}
