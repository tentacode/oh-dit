<?php

declare(strict_types=1);

// tests/object-manager.php

use Doctrine\ORM\EntityManager;

// Bootstrap your application (this depends on your framework)
// For Symfony:
require __DIR__ . '/../config/bootstrap.php';
$kernel = new \App\Kernel('dev', (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();
$container = $kernel->getContainer();

/** @var EntityManager $entityManager */
$entityManager = $container->get('doctrine.orm.entity_manager');

return $entityManager;

// Or for a plain Doctrine setup:
// require __DIR__ . '/../bootstrap.php';
// return $entityManager; // however you create it
