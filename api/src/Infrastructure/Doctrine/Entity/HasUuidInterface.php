<?php

declare(strict_types=1);

namespace App\Infrastructure\Doctrine\Entity;

use Symfony\Component\Uid\Uuid;

interface HasUuidInterface
{
    public function getUuid(): Uuid;
}
