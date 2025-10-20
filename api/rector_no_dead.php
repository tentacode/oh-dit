<?php

declare(strict_types=1);

use Rector\DeadCode\Rector\Array_\RemoveDuplicatedArrayKeyRector;
use Rector\DeadCode\Rector\Assign\RemoveDoubleAssignRector;
use Rector\DeadCode\Rector\Assign\RemoveUnusedVariableAssignRector;
use Rector\DeadCode\Rector\BooleanAnd\RemoveAndTrueRector;
use Rector\DeadCode\Rector\Cast\RecastingRemovalRector;
use Rector\DeadCode\Rector\ClassConst\RemoveUnusedPrivateClassConstantRector;
use Rector\DeadCode\Rector\ClassMethod\RemoveEmptyClassMethodRector;
use Rector\DeadCode\Rector\ClassMethod\RemoveUnusedConstructorParamRector;
use Rector\DeadCode\Rector\ClassMethod\RemoveUnusedPrivateMethodParameterRector;
use Rector\DeadCode\Rector\ClassMethod\RemoveUnusedPrivateMethodRector;
use Rector\DeadCode\Rector\ClassMethod\RemoveUnusedPromotedPropertyRector;
use Rector\DeadCode\Rector\Concat\RemoveConcatAutocastRector;
use Rector\DeadCode\Rector\ConstFetch\RemovePhpVersionIdCheckRector;
use Rector\DeadCode\Rector\Expression\RemoveDeadStmtRector;
use Rector\DeadCode\Rector\Expression\SimplifyMirrorAssignRector;
use Rector\DeadCode\Rector\For_\RemoveDeadContinueRector;
use Rector\DeadCode\Rector\For_\RemoveDeadIfForeachForRector;
use Rector\DeadCode\Rector\For_\RemoveDeadLoopRector;
use Rector\DeadCode\Rector\Foreach_\RemoveUnusedForeachKeyRector;
use Rector\DeadCode\Rector\FunctionLike\RemoveDeadReturnRector;
use Rector\DeadCode\Rector\If_\RemoveAlwaysTrueIfConditionRector;
use Rector\DeadCode\Rector\If_\RemoveDeadInstanceOfRector;
use Rector\DeadCode\Rector\If_\RemoveUnusedNonEmptyArrayBeforeForeachRector;
use Rector\DeadCode\Rector\If_\SimplifyIfElseWithSameContentRector;
use Rector\DeadCode\Rector\If_\UnwrapFutureCompatibleIfPhpVersionRector;
use Rector\DeadCode\Rector\Node\RemoveNonExistingVarAnnotationRector;
use Rector\DeadCode\Rector\Plus\RemoveDeadZeroAndOneOperationRector;
use Rector\DeadCode\Rector\Property\RemoveUnusedPrivatePropertyRector;
use Rector\DeadCode\Rector\PropertyProperty\RemoveNullPropertyInitializationRector;
use Rector\DeadCode\Rector\Return_\RemoveDeadConditionAboveReturnRector;
use Rector\DeadCode\Rector\StaticCall\RemoveParentCallWithoutParentRector;
use Rector\DeadCode\Rector\Stmt\RemoveUnreachableStatementRector;
use Rector\DeadCode\Rector\Switch_\RemoveDuplicatedCaseInSwitchRector;
use Rector\DeadCode\Rector\Ternary\TernaryToBooleanOrFalseToBooleanAndRector;
use Rector\DeadCode\Rector\TryCatch\RemoveDeadTryCatchRector;

$baseConfig = require __DIR__ . '/rector.php';

return $baseConfig->withSkip([
    RecastingRemovalRector::class,
    RemoveAlwaysTrueIfConditionRector::class,
    RemoveAndTrueRector::class,
    RemoveConcatAutocastRector::class,
    RemoveDeadConditionAboveReturnRector::class,
    RemoveDeadContinueRector::class,
    RemoveDeadIfForeachForRector::class,
    RemoveDeadInstanceOfRector::class,
    RemoveDeadLoopRector::class,
    RemoveDeadReturnRector::class,
    RemoveDeadStmtRector::class,
    RemoveDeadTryCatchRector::class,
    RemoveDeadZeroAndOneOperationRector::class,
    RemoveDoubleAssignRector::class,
    RemoveDuplicatedArrayKeyRector::class,
    RemoveDuplicatedCaseInSwitchRector::class,
    RemoveEmptyClassMethodRector::class,
    RemoveNonExistingVarAnnotationRector::class,
    RemoveNullPropertyInitializationRector::class,
    RemoveParentCallWithoutParentRector::class,
    RemovePhpVersionIdCheckRector::class,
    RemoveUnreachableStatementRector::class,
    RemoveUnusedConstructorParamRector::class,
    RemoveUnusedForeachKeyRector::class,
    RemoveUnusedNonEmptyArrayBeforeForeachRector::class,
    RemoveUnusedPrivateClassConstantRector::class,
    RemoveUnusedPrivateMethodParameterRector::class,
    RemoveUnusedPrivateMethodRector::class,
    RemoveUnusedPrivatePropertyRector::class,
    RemoveUnusedPromotedPropertyRector::class,
    RemoveUnusedVariableAssignRector::class,
    SimplifyIfElseWithSameContentRector::class,
    SimplifyMirrorAssignRector::class,
    TernaryToBooleanOrFalseToBooleanAndRector::class,
    UnwrapFutureCompatibleIfPhpVersionRector::class,
]);
