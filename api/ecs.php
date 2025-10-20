<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use PhpCsFixer\Fixer\ArrayNotation\ArraySyntaxFixer;
use PhpCsFixer\Fixer\Import\OrderedImportsFixer;
use PhpCsFixer\Fixer\PhpUnit\PhpUnitMethodCasingFixer;
use Symplify\CodingStandard\Fixer\LineLength\LineLengthFixer;
use Symplify\CodingStandard\Fixer\Spacing\MethodChainingNewlineFixer;
use Symplify\EasyCodingStandard\Config\ECSConfig;
use Symplify\EasyCodingStandard\ValueObject\Set\SetList;

return static function (ECSConfig $ecsConfig): void {
    $ecsConfig->paths([
        __DIR__ . '/bin',
        __DIR__ . '/public',
        __DIR__ . '/src',
        __DIR__ . '/tests',
    ]);

    $ecsConfig->ruleWithConfiguration(ArraySyntaxFixer::class, [
        'syntax' => 'short',
    ]);

    $ecsConfig->sets([
        SetList::PSR_12,
        SetList::SYMPLIFY,
        SetList::COMMON,
        SetList::CLEAN_CODE,
        SetList::STRICT,
    ]);

    $ecsConfig->ruleWithConfiguration(OrderedImportsFixer::class, [
        'imports_order' => ['const', 'function', 'class'],
        'sort_algorithm' => 'alpha',
    ]);

    $ecsConfig->skip([
        PhpUnitMethodCasingFixer::class,
        // this fixer forbid to chain methods on a single line (useful in phpspec "should" methods)
        MethodChainingNewlineFixer::class,
        // this fixer is painful when using sprintf
        LineLengthFixer::class,
    ]);
};
