<?php

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
        $queryBuilder = $this->entityManager->createQueryBuilder();

        $queryBuilder->select('ruleSet')
            ->from(RuleSet::class, 'ruleSet');

        return $queryBuilder->getQuery()->getResult();
    }
}
