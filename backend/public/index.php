<?php

declare(strict_types=1);

use App\Kernel;
use Webmozart\Assert\Assert;

require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';

return function (array $context): Kernel {
    Assert::keyExists($context, 'APP_ENV', 'The APP_ENV environment variable is not set.');
    Assert::keyExists($context, 'APP_DEBUG', 'The APP_DEBUG environment variable is not set.');
    Assert::stringNotEmpty($context['APP_ENV'], 'The APP_ENV environment variable is empty.');

    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
