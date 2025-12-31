<?php

declare(strict_types=1);

namespace App\Features\Issue\Entity;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Features\Project\Entity\Screen;
use App\Features\RuleSet\Entity\Rule;
use App\Infrastructure\Doctrine\Entity\HasUuidInterface;
use App\Infrastructure\Doctrine\Entity\SerializableInterface;
use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'issue')]
class Issue implements HasUuidInterface, SerializableInterface
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[Assert\Uuid(message: 'L\'UUID de la conformité doit être un UUID valide.')]
    private Uuid $uuid;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private DateTimeImmutable $updatedAt;

    #[ManyToOne(targetEntity: User::class)]
    #[JoinColumn(name: 'user_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank(message: "L'utilisateur est obligatoire.")]
    private User $user;

    #[ManyToOne(targetEntity: Rule::class)]
    #[JoinColumn(name: 'rule_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank(message: 'La règle est obligatoire.')]
    private Rule $rule;

    #[ManyToOne(targetEntity: Project::class)]
    #[JoinColumn(name: 'project_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank(message: 'Le projet est obligatoire.')]
    private Project $project;

    #[ORM\Column(type: Types::INTEGER)]
    #[Assert\NotBlank(message: "L'issueId de la recommandation est obligatoire.")]
    private int $issueId;

    #[ManyToOne(targetEntity: Screen::class)]
    #[JoinColumn(name: 'screen_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank(message: 'La page est obligatoire.')]
    private Screen $screen;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank(message: 'Le texte de la recommandation est obligatoire.')]
    private string $text;

    #[ORM\Column(type: Types::STRING, length: 20, enumType: Severity::class)]
    private Severity $severity;

    #[ORM\Column(type: Types::STRING, length: 20, enumType: Status::class)]
    private Status $status;

    #[ManyToOne(targetEntity: User::class)]
    #[JoinColumn(name: 'status_updated_by_user_uuid', referencedColumnName: 'uuid')]
    private User $statusUpdatedBy;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private DateTimeImmutable $statusUpdatedAt;

    /**
     * @var array<int, array<string, string>>
     */
    #[ORM\Column(type: Types::JSON, options: [
        'jsonb' => true,
    ])]
    private array $statusChangeHistory = [];

    public function __construct(
        User $user,
        Rule $rule,
        Project $project,
        Screen $screen,
        int $issueId,
        string $text,
        Severity $severity,

        // used for fixtures
        ?DateTimeImmutable $createdAt = null,
        ?string $uuid = null,
        ?Status $status = null,
    ) {
        $this->user = $user;
        $this->rule = $rule;
        $this->project = $project;
        $this->issueId = $issueId;
        $this->screen = $screen;
        $this->text = $text;
        $this->severity = $severity;

        $this->changeStatus($user, $status ?? Status::PENDING);

        // used for fixtures
        $this->uuid = $uuid ? Uuid::fromString($uuid) : Uuid::v4();
        $this->createdAt = $createdAt ?? CarbonImmutable::now();
        $this->updatedAt = $createdAt ?? CarbonImmutable::now();
    }

    public function getUuid(): Uuid
    {
        return $this->uuid;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getText(): string
    {
        return $this->text;
    }

    public function setText(string $text): void
    {
        $this->text = $text;
        $this->updatedAt = CarbonImmutable::now();
    }

    public function getSeverity(): Severity
    {
        return $this->severity;
    }

    public function setSeverity(Severity $severity): void
    {
        $this->severity = $severity;
        $this->updatedAt = CarbonImmutable::now();
    }

    public function getStatus(): Status
    {
        return $this->status;
    }

    public function changeStatus(User $user, Status $status): void
    {
        $this->status = $status;
        $this->statusUpdatedAt = CarbonImmutable::now();
        $this->updatedAt = CarbonImmutable::now();
        $this->statusUpdatedBy = $user;

        $this->statusChangeHistory[] = [
            'status' => $status->value,
            'statusUpdatedBy' => $user->getUuid()->toString(),
            'statusUpdatedAt' => $this->statusUpdatedAt->format(DateTimeImmutable::ATOM),
        ];
    }

    public function getStatusUpdatedBy(): ?User
    {
        return $this->statusUpdatedBy;
    }

    public function getStatusUpdatedAt(): ?DateTimeImmutable
    {
        return $this->statusUpdatedAt;
    }

    /**
     * @return array<int, array<string, string>>
     */
    public function getStatusChangeHistory(): array
    {
        return $this->statusChangeHistory;
    }

    public function getRule(): Rule
    {
        return $this->rule;
    }

    public function getProject(): Project
    {
        return $this->project;
    }

    public function getScreen(): Screen
    {
        return $this->screen;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function getRuleUuid(): Uuid
    {
        return $this->rule->getUuid();
    }

    public function getProjectUuid(): Uuid
    {
        return $this->project->getUuid();
    }

    public function getScreenUuid(): Uuid
    {
        return $this->screen->getUuid();
    }

    public function getUserUuid(): Uuid
    {
        return $this->user->getUuid();
    }

    public function getIssueId(): int
    {
        return $this->issueId;
    }

    public function getDefaultFields(): array
    {
        return [
            'uuid',
            'issueId',
            'createdAt',
            'updatedAt',
            'text',
            'severity',
            'status',
            'statusUpdatedAt',
            'statusUpdatedBy',
            'statusChangeHistory',
            'ruleUuid',
            'projectUuid',
            'screenUuid',
            'userUuid',
        ];
    }
}
