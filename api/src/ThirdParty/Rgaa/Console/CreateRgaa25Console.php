<?php

declare(strict_types=1);

namespace App\ThirdParty\Rgaa\Console;

use App\Features\RuleSet\Entity\Rule;
use App\Features\RuleSet\Entity\RuleCategory;
use App\Features\RuleSet\Entity\RuleSet;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'rgaa:create-25', description: 'Create simple RGAA rule set with 25 rules.')]
class CreateRgaa25Console extends Command
{
    /**
     * @var array<int, array<string>>
     */
    private array $ruleCategoryPrefixes = [
        '1' => ['1.1'],
        '3' => ['3.1'],
        '4' => ['4.1', '4.10'],
        '5' => ['5.3', '5.7'],
        '6' => ['6.1', '6.2'],
        '7' => ['7.1', '7.3'],
        '8' => ['8.3', '8.4', '8.5'],
        '9' => ['9.1'],
        '10' => ['10.3', '10.5', '10.7'],
        '11' => ['11.1', '11.2', '11.5', '11.6', '11.9', '11.10'],
        '12' => ['12.8', '12.9'],
    ];

    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $symfonyStyle = new SymfonyStyle($input, $output);

        $symfonyStyle->title('Creating RGAA 25 RuleSet');

        $existingRuleSet = $this->entityManager->getRepository(RuleSet::class)->findOneBy([
            'name' => RuleSet::RGAA_25_NAME,
        ]);
        if ($existingRuleSet !== null) {
            $symfonyStyle->error('RGAA 25 RuleSet already exists.');
            return Command::FAILURE;
        }

        $rgaaRuleSet = $this->entityManager->getRepository(RuleSet::class)->findOneBy([
            'name' => RuleSet::RGAA_NAME,
        ]);

        $ruleSet = new RuleSet(name: RuleSet::RGAA_25_NAME, description: 'Version simplifiée du Référentiel Général d’Amélioration de l’Accessibilité (RGAA), 25 critères', version: '4.1.2');
        $this->entityManager->persist($ruleSet);

        foreach ($this->ruleCategoryPrefixes as $categoryPrefix => $rulePrefixes) {
            $rgaaRuleCategory = $this->entityManager->getRepository(RuleCategory::class)->findOneBy([
                'prefix' => $categoryPrefix,
                'ruleSet' => $rgaaRuleSet,
            ]);

            if ($rgaaRuleCategory === null) {
                $symfonyStyle->error(sprintf('Rule category with prefix "%s" not found.', $categoryPrefix));

                return Command::FAILURE;
            }

            $ruleCategory = new RuleCategory(
                ruleSet: $ruleSet,
                name: $rgaaRuleCategory->getName(),
                prefix: $rgaaRuleCategory->getPrefix(),
            );

            $this->entityManager->persist($ruleCategory);

            foreach ($rulePrefixes as $rulePrefix) {
                $rgaaRule = $this->entityManager->getRepository(Rule::class)->findOneBy([
                    'prefix' => $rulePrefix,
                    'ruleCategory' => $rgaaRuleCategory,
                ]);

                if ($rgaaRule === null) {
                    $symfonyStyle->error(sprintf('Rule with prefix "%s" not found.', $rulePrefix));

                    return Command::FAILURE;
                }

                $rule = new Rule(
                    ruleCategory: $ruleCategory,
                    shortDescription: $rgaaRule->getShortDescription(),
                    prefix: $rgaaRule->getPrefix(),
                );

                $this->entityManager->persist($rule);
            }
        }

        $this->entityManager->flush();

        $symfonyStyle->success('RGAA 25 ruleset created successfully.');

        return Command::SUCCESS;
    }
}
