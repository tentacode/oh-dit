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
    public const string ROOT_SCREEN_NAME = 'Éléments transverses';

    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[Assert\Uuid(message: 'L\'UUID de la page doit être un UUID valide.')]
    private Uuid $uuid;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank(message: 'Le nom de la page est obligatoire.')]
    private string $name;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $isRoot = false;

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
        bool $isRoot = false,
        ?string $uuid = null
    ) {
        $this->uuid = $uuid ? Uuid::fromString($uuid) : Uuid::v4();
        $this->project = $project;
        $this->name = $name;
        $this->isRoot = $isRoot;
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

    public function getIsRoot(): bool
    {
        return $this->isRoot;
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
