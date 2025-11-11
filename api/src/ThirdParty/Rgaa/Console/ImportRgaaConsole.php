<?php

declare(strict_types=1);

namespace App\ThirdParty\Rgaa\Console;

use function Safe\file_get_contents;
use function Safe\json_decode;
use App\Features\RuleSet\Entity\Rule;
use App\Features\RuleSet\Entity\RuleCategory;
use App\Features\RuleSet\Entity\RuleSet;
use Doctrine\ORM\EntityManagerInterface;
use Parsedown;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Throwable;
use Webmozart\Assert\Assert;

#[AsCommand(name: 'rgaa:import', description: 'Import RGAA 4.1.2 as a RuleSet.')]
class ImportRgaaConsole extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private string $projectDirectory,
        private Parsedown $parsedown = new Parsedown(),
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $symfonyStyle = new SymfonyStyle($input, $output);

        $symfonyStyle->title('Importing RGAA 4.1.2 from json files');

        $criteriaFilePath = $this->projectDirectory . '/var/data/rgaa-git/RGAA/criteres.json';
        $criteriaJson = file_get_contents($criteriaFilePath);

        $criteria = json_decode($criteriaJson, true);
        Assert::isArray($criteria);

        $this->entityManager->getConnection()->beginTransaction();
        try {
            $this->createRuleSet($criteria);
            $this->entityManager->getConnection()->commit();
        } catch (Throwable $e) {
            $this->entityManager->getConnection()->rollBack();
            throw $e;
        }

        $symfonyStyle->success('RGAA 4.1.2 imported successfully.');

        return Command::SUCCESS;
    }

    /**
     * @param array<mixed> $criteria
     */
    private function createRuleSet(array $criteria): void
    {
        $ruleSet = new RuleSet(
            name: RuleSet::RGAA_NAME,
            description: 'Référentiel Général d’Amélioration de l’Accessibilité (RGAA)',
            version: '4.1.2',
        );

        $this->entityManager->persist($ruleSet);

        $this->createRuleSetCategories($ruleSet, $criteria);
    }

    /**
     * @param array<mixed> $criteria
     */
    private function createRuleSetCategories(RuleSet $ruleSet, array $criteria): void
    {
        Assert::keyExists($criteria, 'topics');
        Assert::notEmpty($criteria['topics']);

        /** @var array<mixed> $topics */
        $topics = $criteria['topics'];

        foreach ($topics as $topic) {
            Assert::isArray($topic);
            Assert::keyExists($topic, 'topic');
            Assert::keyExists($topic, 'number');

            Assert::string($topic['topic']);
            Assert::numeric($topic['number']);

            $ruleCategory = new RuleCategory(
                ruleSet: $ruleSet,
                name: $topic['topic'],
                prefix: (string) $topic['number'],
            );

            $this->entityManager->persist($ruleCategory);

            $this->createRules($ruleCategory, $topic);
        }

        $this->entityManager->flush();
    }

    /**
     * @param array<mixed> $topic
     */
    private function createRules(RuleCategory $ruleCategory, array $topic): void
    {
        Assert::keyExists($topic, 'criteria');
        Assert::notEmpty($topic['criteria']);

        /** @var array<mixed> $criteria */
        $criteria = $topic['criteria'];

        foreach ($criteria as $criterion) {
            Assert::isArray($criterion);
            Assert::keyExists($criterion, 'criterium');
            Assert::isArray($criterion['criterium']);
            Assert::keyExists($criterion['criterium'], 'title');
            Assert::keyExists($criterion['criterium'], 'number');

            Assert::string($criterion['criterium']['title']);
            Assert::numeric($criterion['criterium']['number']);
            Assert::numeric($topic['number']);

            $rule = new Rule(
                ruleCategory: $ruleCategory,
                shortDescription: $this->removeMarkdown($criterion['criterium']['title']),
                prefix: sprintf(
                    '%d.%d',
                    $topic['number'],
                    $criterion['criterium']['number'],
                ),
            );

            $this->entityManager->persist($rule);
        }
    }

    private function removeMarkdown(string $markdown): string
    {
        $html = $this->parsedown->text($markdown);
        Assert::string($html);

        return strip_tags($html);
    }
}
