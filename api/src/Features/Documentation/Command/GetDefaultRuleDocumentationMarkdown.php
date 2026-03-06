<?php

declare(strict_types=1);

namespace App\Features\Documentation\Command;

use App\Features\Documentation\Query\GetRuleDocumentationCommandInterface;
use App\Features\RuleSet\Entity\Rule;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class GetDefaultRuleDocumentationMarkdown implements GetRuleDocumentationCommandInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(string $ruleUuid): string
    {
        $rule = $this->entityManager->getRepository(Rule::class)->findOneByUuid($ruleUuid);
        if (! $rule instanceof Rule) {
            throw new NotFoundHttpException('Rule not found.');
        }

        return <<<MARKDOWN
            #### Documentation

            Aucune documentation spécifique n'est disponible pour ce critère.
            MARKDOWN;
    }
}
