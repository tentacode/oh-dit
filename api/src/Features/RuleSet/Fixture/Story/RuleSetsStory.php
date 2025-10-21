<?php

declare(strict_types=1);

namespace App\Features\RuleSet\Fixture\Story;

use function Safe\file_get_contents;
use function Safe\json_decode;
use App\Features\RuleSet\Fixture\Factory\RuleSetFactory;
use App\Features\RuleSet\Fixture\Factory\RuleCategoryFactory;
use App\Features\RuleSet\Fixture\Factory\RuleFactory;
use Zenstruck\Foundry\Attribute\AsFixture;
use Zenstruck\Foundry\Story;

#[AsFixture(name: 'rule_sets', groups: ['all'])]
final class RuleSetsStory extends Story
{
    public const RULE_SET_EMPIRE_UUID = '12341234-0000-0000-0000-000000000001';

    public const RULE_CATEGORY_BASE_UUID = '12341234-1111-0000-0000-';

    public const RULE_BASE_UUID = '12341234-2222-0000-';

    public function build(): void
    {
        $ruleSetData = json_decode(file_get_contents(__DIR__ . '/empireRuleSet.json'), true);

        $ruleSet = RuleSetFactory::createOne([
            'uuid' => self::RULE_SET_EMPIRE_UUID,
            'name' => $ruleSetData['ruleSet']['name'],
            'description' => $ruleSetData['ruleSet']['description'],
            'version' => $ruleSetData['ruleSet']['version'],
        ]);

        $categoryIndex = 1;
        foreach ($ruleSetData['ruleSet']['ruleSetCategories'] as $categoryData) {
            $ruleCategory = RuleCategoryFactory::createOne([
                'uuid' => self::RULE_CATEGORY_BASE_UUID . str_pad((string)$categoryIndex, 12, '0', STR_PAD_LEFT),
                'prefix' => $categoryData['prefix'],
                'name' => $categoryData['name'],
                'ruleSet' => $ruleSet,
            ]);

            $ruleIndex = 1;
            foreach ($categoryData['rules'] as $ruleData) {
                RuleFactory::createOne([
                    'uuid' => self::RULE_BASE_UUID . str_pad((string)$categoryIndex, 4, '0', STR_PAD_LEFT) . '-' . str_pad((string)$ruleIndex, 12, '0', STR_PAD_LEFT),
                    'prefix' => $ruleData['prefix'],
                    'shortDescription' => $ruleData['description'],
                    'ruleCategory' => $ruleCategory,
                ]);

                $ruleIndex++;
            }

            $categoryIndex++;
        }
    }
}
