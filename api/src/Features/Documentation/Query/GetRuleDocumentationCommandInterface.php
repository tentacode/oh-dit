<?php

declare(strict_types=1);

namespace App\Features\Documentation\Query;

interface GetRuleDocumentationCommandInterface
{
    public function __invoke(string $ruleUuid): string;
}
