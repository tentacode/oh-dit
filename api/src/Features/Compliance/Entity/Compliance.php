<?php

declare(strict_types=1);

namespace App\Features\Compliance\Entity;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Features\Project\Entity\Screen;
use App\Features\RuleSet\Entity\Rule;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Safe\DateTimeImmutable;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

enum ComplianceStatus: string
{
    case COMPLIANT = 'compliant';
    case NON_COMPLIANT = 'non_compliant';
    case NOT_APPLICABLE = 'not_applicable';
}

#[ORM\Entity]
#[ORM\Table(name: 'compliance')]
class Compliance
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private readonly Uuid $uuid;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private DateTimeImmutable $createdAt;

    #[ManyToOne(targetEntity: User::class)]
    #[JoinColumn(name: 'user_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank]
    private User $user;

    #[ManyToOne(targetEntity: Rule::class)]
    #[JoinColumn(name: 'rule_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank]
    private Rule $rule;

    #[ManyToOne(targetEntity: Project::class)]
    #[JoinColumn(name: 'project_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank]
    private Project $project;

    #[ManyToOne(targetEntity: Screen::class)]
    #[JoinColumn(name: 'screen_uuid', referencedColumnName: 'uuid')]
    private ?Screen $screen;

    #[ORM\Column(type: Types::STRING, length: 20, enumType: ComplianceStatus::class)]
    private ComplianceStatus $status;

    public function __construct(
        User $user,
        Rule $rule,
        Project $project,
        ComplianceStatus $status,
        ?Screen $screen = null,
        // used for fixtures
        ?DateTimeImmutable $createdAt = null,
    ) {
        $this->uuid = Uuid::v4();
        $this->createdAt = $createdAt ?? new DateTimeImmutable();
        $this->user = $user;
        $this->rule = $rule;
        $this->project = $project;
        $this->screen = $screen;
        $this->status = $status;
    }

    public function getUuid(): Uuid
    {
        return $this->uuid;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getStatus(): ComplianceStatus
    {
        return $this->status;
    }

    public function getRule(): Rule
    {
        return $this->rule;
    }

    public function getProject(): Project
    {
        return $this->project;
    }

    public function getScreen(): ?Screen
    {
        return $this->screen;
    }

    public function setStatus(ComplianceStatus $status): void
    {
        $this->status = $status;
    }

    public function getUser(): User
    {
        return $this->user;
    }
}
