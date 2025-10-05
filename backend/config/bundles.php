<?php

declare(strict_types=1);

use Symfony\Bundle\FrameworkBundle\FrameworkBundle;
use Doctrine\Bundle\DoctrineBundle\DoctrineBundle;
use Doctrine\Bundle\MigrationsBundle\DoctrineMigrationsBundle;
use DAMA\DoctrineTestBundle\DAMADoctrineTestBundle;
use Symfony\Bundle\SecurityBundle\SecurityBundle;
use Lexik\Bundle\JWTAuthenticationBundle\LexikJWTAuthenticationBundle;
use Sentry\SentryBundle\SentryBundle;
use Zenstruck\Foundry\ZenstruckFoundryBundle;

return [
    FrameworkBundle::class => ['all' => true],
    DoctrineBundle::class => ['all' => true],
    DoctrineMigrationsBundle::class => ['all' => true],
    DAMADoctrineTestBundle::class => ['test' => true],
    SecurityBundle::class => ['all' => true],
    LexikJWTAuthenticationBundle::class => ['all' => true],
    SentryBundle::class => ['prod' => true, 'dev' => true],
    ZenstruckFoundryBundle::class => ['dev' => true, 'test' => true],
];
