<?php

declare(strict_types=1);

namespace App\Features\Project\Entity;

use App\Features\Authentication\Entity\Team;
use App\Features\RuleSet\Entity\RuleSet;
use App\Infrastructure\Doctrine\Entity\HasUuidInterface;
use App\Infrastructure\Doctrine\Entity\SerializableInterface;
use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
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
class Project implements HasUuidInterface, SerializableInterface
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[Assert\Uuid(message: 'L\'UUID du projet doit être un UUID valide.')]
    private Uuid $uuid;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank(message: 'Le nom du projet est obligatoire.')]
    private string $name;

    #[ORM\Column(type: Types::TEXT)]
    private string $url;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private readonly DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private DateTimeImmutable $updatedAt;

    #[ManyToOne(targetEntity: Team::class)]
    #[JoinColumn(name: 'team_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank]
    private Team $team;

    #[ManyToOne(targetEntity: RuleSet::class)]
    #[JoinColumn(name: 'rule_set_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank]
    private RuleSet $ruleSet;

    #[ORM\Column(type: Types::STRING, length: 20, enumType: ProjectStatus::class)]
    private ProjectStatus $status = ProjectStatus::IN_PROGRESS;

    #[ORM\Column(type: Types::INTEGER)]
    private int $progress = 0;

    #[ORM\Column(type: Types::INTEGER)]
    private int $complianceRate = 0;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?DateTimeImmutable $complianceRateUpdatedAt = null;

    /**
     * @var ArrayCollection<int, Screen>
     */
    #[ORM\OneToMany(targetEntity: Screen::class, mappedBy: 'project')]
    #[ORM\OrderBy([
        'rank' => 'ASC',
    ])]
    private Collection $screens;

    public function __construct(
        Team $team,
        RuleSet $ruleSet,
        string $name,
        string $url,
        ?string $uuid = null
    ) {
        $this->uuid = $uuid ? Uuid::fromString($uuid) : Uuid::v4();
        $this->team = $team;
        $this->ruleSet = $ruleSet;
        $this->screens = new ArrayCollection();
        $this->name = $name;
        $this->url = $url;
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

    public function getRuleSet(): RuleSet
    {
        return $this->ruleSet;
    }

    /**
     * @return Collection<int, Screen>
     */
    public function getScreens(): Collection
    {
        return $this->screens;
    }

    public function addScreen(Screen $screen): void
    {
        if (! $this->screens->contains($screen)) {
            $this->screens->add($screen);
        }
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getComplianceRateUpdatedAt(): ?DateTimeImmutable
    {
        return $this->complianceRateUpdatedAt;
    }

    public function getStatus(): ProjectStatus
    {
        return $this->status;
    }

    public function getProgress(): int
    {
        return $this->progress;
    }

    public function getComplianceRate(): int
    {
        return $this->complianceRate;
    }

    public function markAsCompleted(): void
    {
        $this->status = ProjectStatus::COMPLETED;
        $this->updatedAt = CarbonImmutable::now();
    }

    public function updateMetrics(int $progress, int $complianceRate): void
    {
        $this->progress = $progress;
        $this->complianceRate = $complianceRate;
        $this->complianceRateUpdatedAt = CarbonImmutable::now();
        $this->updatedAt = CarbonImmutable::now();
    }

    public function getDefaultFields(): array
    {
        return [
            'uuid',
            'name',
            'url',
            'createdAt',
            'updatedAt',
            'status',
            'progress',
            'complianceRate',
            'ruleSet' => [
                'uuid',
                'name',
                'version',
            ],
            'screens' => [
                'uuid',
                'name',
                'url',
                'rank',
                'progress',
                'complianceRate',
                'isRoot',
            ],
        ];
    }
}
