<?php

declare(strict_types=1);

namespace App\Features\RuleSet\Query;

use App\Features\RuleSet\Entity\RuleSet;
use Doctrine\ORM\EntityManagerInterface;

class GetRuleSetQuery
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(string $uuid): ?RuleSet
    {
        return $this->entityManager
            ->getRepository(RuleSet::class)
            ->findOneByUuid($uuid);
    }
}
