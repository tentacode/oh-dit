<?php

declare(strict_types=1);

use Symfony\Bundle\FrameworkBundle\FrameworkBundle;
use Doctrine\Bundle\DoctrineBundle\DoctrineBundle;
use Doctrine\Bundle\MigrationsBundle\DoctrineMigrationsBundle;
use Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle;
use Nelmio\Alice\Bridge\Symfony\NelmioAliceBundle;
use DAMA\DoctrineTestBundle\DAMADoctrineTestBundle;
use Symfony\Bundle\SecurityBundle\SecurityBundle;
use Lexik\Bundle\JWTAuthenticationBundle\LexikJWTAuthenticationBundle;

return [
    FrameworkBundle::class => ['all' => true],
    DoctrineBundle::class => ['all' => true],
    DoctrineMigrationsBundle::class => ['all' => true],
    DoctrineFixturesBundle::class => ['dev' => true, 'test' => true],
    NelmioAliceBundle::class => ['dev' => true, 'test' => true],
    DAMADoctrineTestBundle::class => ['test' => true],
    SecurityBundle::class => ['all' => true],
    LexikJWTAuthenticationBundle::class => ['all' => true],
];
