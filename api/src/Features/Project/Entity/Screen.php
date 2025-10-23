<?php

declare(strict_types=1);

namespace App\Features\Project\Entity;

use App\Infrastructure\Doctrine\Entity\HasUuidInterface;
use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'project_screen')]
class Screen implements HasUuidInterface
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private readonly Uuid $uuid;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    private string $name;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private readonly DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private DateTimeImmutable $updatedAt;

    #[ManyToOne(targetEntity: Project::class)]
    #[JoinColumn(name: 'project_uuid', referencedColumnName: 'uuid')]
    private Project $project;

    public function __construct(
        Project $project,
        string $name,
        ?string $uuid = null
    ) {
        $this->uuid = $uuid ? Uuid::fromString($uuid) : Uuid::v4();
        $this->project = $project;
        $this->name = $name;
        $this->createdAt = CarbonImmutable::now();
        $this->updatedAt = CarbonImmutable::now();
    }

    public function getUuid(): Uuid
    {
        return $this->uuid;
    }

    public function getProject(): Project
    {
        return $this->project;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTimeImmutable
    {
        return $this->updatedAt;
    }
}
