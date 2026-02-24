<?php

declare(strict_types=1);

namespace App\Features\Compliance\Entity;

enum ComplianceStatus: string
{
    case NONE = 'none';
    case COMPLIANT = 'compliant';
    case NON_COMPLIANT = 'non_compliant';
    case NOT_APPLICABLE = 'not_applicable';
}
