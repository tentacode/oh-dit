<?php

declare(strict_types=1);

namespace App\Features\RuleSet\Query;

use App\Features\RuleSet\Entity\RuleSet;
use Doctrine\ORM\EntityManagerInterface;

class GetRuleSetsQuery
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @return array<RuleSet>
     */
    public function __invoke(): array
    {
        return $this->entityManager
            ->getRepository(RuleSet::class)
            ->findAll();
    }
}
