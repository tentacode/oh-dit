<?php

declare(strict_types=1);

namespace App\Features\Issue\Entity;

enum Status: string
{
    case PENDING = 'pending';
    case FIXED = 'fixed';
}
