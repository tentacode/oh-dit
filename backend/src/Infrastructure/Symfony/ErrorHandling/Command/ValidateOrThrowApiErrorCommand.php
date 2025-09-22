<?php

declare(strict_types=1);

namespace App\Infrastructure\Symfony\ErrorHandling\Command;

use Exception;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Webmozart\Assert\Assert;

final readonly class ValidateOrThrowApiErrorCommand
{
    public function __construct(
        private ValidatorInterface $validator
    ) {
    }

    public function __invoke(mixed $object): void
    {
        $errors = $this->validator->validate($object);

        // @TODO: throw specific exception with all errors
        if (count($errors) > 0) {
            Assert::isInstanceOf($errors[0], ConstraintViolation::class);
            throw new Exception((string) $errors[0]->getMessage());
        }
    }
}
