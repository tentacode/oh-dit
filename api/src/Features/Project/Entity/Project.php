<?php

declare(strict_types=1);

namespace App\Features\Project\Entity;

use App\Features\Authentication\Entity\Team;
use App\Infrastructure\Doctrine\Entity\HasUuidInterface;
use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Symfony\Component\Serializer\Attribute\Ignore;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

enum ProjectStatus: string
{
    case IN_PROGRESS = 'in_progress';
    case ON_HOLD = 'on_hold';
    case COMPLETED = 'completed';
}

#[ORM\Entity]
#[ORM\Table(name: 'project')]
class Project implements HasUuidInterface
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

    #[ManyToOne(targetEntity: Team::class)]
    #[JoinColumn(name: 'team_uuid', referencedColumnName: 'uuid')]
    #[Ignore]
    #[Assert\NotBlank]
    private Team $team;

    // TODO: add as column
    private string $status = ProjectStatus::IN_PROGRESS->value;

    /**
     * @var ArrayCollection<int, Screen>
     */
    #[ORM\OneToMany(targetEntity: Screen::class, mappedBy: 'project')]
    private Collection $screens;

    public function __construct(
        Team $team,
        string $name,
        ?string $uuid = null
    ) {
        $this->uuid = $uuid ? Uuid::fromString($uuid) : Uuid::v4();
        $this->team = $team;
        $this->screens = new ArrayCollection();
        $this->name = $name;
        $this->createdAt = CarbonImmutable::now();
        $this->updatedAt = CarbonImmutable::now();
    }

    public function getUuid(): Uuid
    {
        return $this->uuid;
    }

    public function getTeam(): Team
    {
        return $this->team;
    }

    /**
     * @return Collection<int, Screen>
     */
    public function getScreens(): Collection
    {
        return $this->screens;
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

    public function getStatus(): string
    {
        return $this->status;
    }
}
