<?php

declare(strict_types=1);

namespace App\Features\Documentation\Command;

use function Safe\file_get_contents;
use function Safe\json_decode;
use function Safe\preg_match;
use function Safe\preg_replace;
use App\Features\Documentation\Query\GetRuleDocumentationCommandInterface;
use App\Features\RuleSet\Entity\Rule;
use Doctrine\ORM\EntityManagerInterface;
use League\CommonMark\CommonMarkConverter;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Webmozart\Assert\Assert;

final class GetRgaaRuleDocumentationMarkdown implements GetRuleDocumentationCommandInterface
{
    /**
     * @var array<string, mixed>
     */
    private array $rulesData;

    public function __construct(
        private string $projectDirectory,
        private EntityManagerInterface $entityManager,
        private CommonMarkConverter $markdownConverter = new CommonMarkConverter(),
    ) {
        $rgaaDataFolder = $this->projectDirectory . '/var/data/rgaa-git/RGAA/';

        $rulesData = json_decode(
            file_get_contents($rgaaDataFolder . 'criteres.json'),
            true,
        );
        Assert::isArray($rulesData);
        /** @var array<string, mixed> $rulesData */
        $this->rulesData = $rulesData;
    }

    public function __invoke(string $ruleUuid): string
    {
        $rule = $this->entityManager->getRepository(Rule::class)->findOneByUuid($ruleUuid);
        if (! $rule instanceof Rule) {
            throw new NotFoundHttpException('Rule not found.');
        }

        $ruleData = $this->getRuleData($rule);

        $testsMarkdown = $this->getTestsMarkdown($rule, $ruleData);
        $linkListMarkdown = $this->getLinkListMarkdown($rule, $ruleData);

        return <<<MARKDOWN
            {$testsMarkdown}


            {$linkListMarkdown}
            MARKDOWN;
    }

    /**
     * @return array<string, mixed>
     */
    private function getRuleData(Rule $rule): array
    {
        $prefix = $rule->getPrefix();
        Assert::notNull($prefix);

        $prefixParts = explode('.', $prefix);
        Assert::minCount($prefixParts, 2);
        $ruleCategoryIndex = $prefixParts[0];
        $ruleIndex = $prefixParts[1];

        $topics = $this->rulesData['topics'] ?? [];
        Assert::isArray($topics);

        /** @var array<int, array{number: int|string, criteria: array<int, array{criterium: array<string, mixed>}>}> $topics */
        $rulesCategory = array_filter(
            $topics,
            static fn (array $categoryData): bool => (string) $categoryData['number'] === $ruleCategoryIndex,
        );

        $ruleCategory = array_shift($rulesCategory);
        Assert::isArray($ruleCategory, 'Rule category data not found.');

        $criteria = $ruleCategory['criteria'];

        $ruleDatas = array_filter(
            $criteria,
            // @phpstan-ignore-next-line
            static fn (array $data): bool => (string) $data['criterium']['number'] === $ruleIndex,
        );

        $ruleData = array_shift($ruleDatas);
        Assert::isArray($ruleData, 'Rule data not found.');

        $criterium = $ruleData['criterium'];

        /** @var array<string, mixed> $criterium */
        return $criterium;
    }

    /**
     * @param array<string, mixed> $ruleData
     */
    private function getTestsMarkdown(Rule $rule, array $ruleData): string
    {
        $testsMarkdowns = [];
        $tests = $ruleData['tests'] ?? [];

        if (! is_array($tests)) {
            return '';
        }

        foreach ($tests as $testIndex => $testItems) {
            if (! is_array($testItems)) {
                continue;
            }

            $firstTest = array_shift($testItems);
            if (! is_string($firstTest)) {
                continue;
            }

            $firstTestString = $this->removeMarkdown($firstTest);

            $testMarkdown = <<<MARKDOWN
                <div class="ruleDocumentationTest">
                ##### {$rule->getPrefix()}.{$testIndex} {$firstTestString}


                MARKDOWN;

            foreach ($testItems as $testItem) {
                if (is_string($testItem)) {
                    $testMarkdown .= sprintf("- %s\n", $this->removeMarkdown($testItem));
                }
            }

            $testMarkdown .= '</div>';
            $testsMarkdowns[] = $testMarkdown;
        }

        if ($testsMarkdowns === []) {
            return '';
        }

        $testsMarkdown = implode("\n\n", $testsMarkdowns);

        return <<<MARKDOWN
            #### Tests associés

            {$testsMarkdown}
            MARKDOWN;
    }

    /**
     * @param array<string, mixed> $ruleData
     */
    private function getLinkListMarkdown(Rule $rule, array $ruleData): string
    {
        /** @var list<string> $links */
        $links = [];
        $rulePrefix = $rule->getPrefix();

        $links[] = sprintf(
            '- [RGAA 4.1.2 - Critère %s](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#%s)',
            $rulePrefix,
            $rulePrefix,
        );

        $references = $ruleData['references'] ?? [];
        if (! is_array($references)) {
            return implode("\n", $links);
        }

        foreach ($references as $reference) {
            if (! is_array($reference)) {
                continue;
            }

            $wcagList = $reference['wcag'] ?? [];
            if (is_array($wcagList)) {
                foreach ($wcagList as $wcagReference) {
                    if (! is_string($wcagReference)) {
                        continue;
                    }

                    $matchResult = preg_match('/^[0-9.]+ (.*) \(A+\)$/', $wcagReference, $matches);
                    if ($matchResult === 0) {
                        continue;
                    }

                    $wcagSlug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', trim($matches[1])));

                    $links[] = sprintf(
                        '- [WCAG - %s](https://www.w3.org/WAI/WCAG22/Understanding/%s.html)',
                        $wcagReference,
                        $wcagSlug,
                    );
                }
            }

            $techniques = $reference['techniques'] ?? [];
            if (is_array($techniques)) {
                foreach ($techniques as $technique) {
                    if (! is_string($technique)) {
                        continue;
                    }

                    $matchResult = preg_match('/^([A-Z]+)\d+$/', $technique, $matches);
                    if ($matchResult === 0) {
                        continue;
                    }

                    $folder = match ($matches[1]) {
                        'H' => 'html',
                        'G' => 'general',
                        'C' => 'css',
                        'ARIA' => 'aria',
                        'PDF' => 'pdf',
                        default => null,
                    };

                    if ($folder === null) {
                        continue;
                    }

                    $links[] = sprintf(
                        '- [WCAG Technique - %s](https://www.w3.org/WAI/WCAG22/Techniques/%s/%s)',
                        $technique,
                        $folder,
                        $technique,
                    );
                }
            }
        }

        $linksMarkdown = implode("\n", $links);

        return <<<MARKDOWN
            #### Liens utiles

            {$linksMarkdown}
            MARKDOWN;
    }

    private function removeMarkdown(string $markdown): string
    {
        $html = $this->markdownConverter->convert($markdown)->getContent();

        return strip_tags($html);
    }
}
