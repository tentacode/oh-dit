<?php

declare(strict_types=1);

namespace App\Features\Documentation\Query;

use App\Features\Documentation\Command as DocumentationCommand;
use App\Features\RuleSet\Entity\Rule;
use App\Features\RuleSet\Entity\RuleSet;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\AutowireLocator;
use Symfony\Component\DependencyInjection\ServiceLocator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class GetWhichDocumentationCommandQuery
{
    /**
     * @param ServiceLocator<GetRuleDocumentationCommandInterface> $locator
     */
    public function __construct(
        private EntityManagerInterface $entityManager,
        #[AutowireLocator([
            DocumentationCommand\GetRgaaRuleDocumentationMarkdown::class,
            DocumentationCommand\GetRaamRuleDocumentationMarkdown::class,
            DocumentationCommand\GetRawebRuleDocumentationMarkdown::class,
            DocumentationCommand\GetRapdfRuleDocumentationMarkdown::class,
            DocumentationCommand\GetDefaultRuleDocumentationMarkdown::class,
        ])]
        private ServiceLocator $locator,
    ) {
    }

    public function __invoke(string $ruleUuid): GetRuleDocumentationCommandInterface
    {
        $rule = $this->entityManager->getRepository(Rule::class)->findOneByUuid($ruleUuid);
        if (! $rule instanceof Rule) {
            throw new NotFoundHttpException('Rule not found.');
        }

        $ruleSet = $rule->getRuleCategory()->getRuleSet();

        return match ($ruleSet->getName()) {
            RuleSet::RGAA_NAME, RuleSet::RGAA_25_NAME => $this->locator->get(DocumentationCommand\GetRgaaRuleDocumentationMarkdown::class),
            RuleSet::RAAM_NAME => $this->locator->get(DocumentationCommand\GetRaamRuleDocumentationMarkdown::class),
            RuleSet::RAPDF_NAME => $this->locator->get(DocumentationCommand\GetRapdfRuleDocumentationMarkdown::class),
            RuleSet::RAWEB_NAME => $this->locator->get(DocumentationCommand\GetRawebRuleDocumentationMarkdown::class),
            default => $this->locator->get(DocumentationCommand\GetDefaultRuleDocumentationMarkdown::class),
        };
    }
}
