<?php

declare(strict_types=1);

use PhpCsFixer\Fixer\ArrayNotation\ArraySyntaxFixer;
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

    $ecsConfig->skip([
        // this fixer forbid to chain methods on a single line (useful in phpspec "should" methods)
        Symplify\CodingStandard\Fixer\Spacing\MethodChainingNewlineFixer::class,
        // this fixer is painful when using sprintf
        Symplify\CodingStandard\Fixer\LineLength\LineLengthFixer::class,
    ]);
};