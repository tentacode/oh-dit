<?php

declare(strict_types=1);

namespace App\Infrastructure\Doctrine\Entity;

interface SerializableInterface
{
    /**
     * @return array<mixed>
     */
    public function getDefaultFields(): array;
}
