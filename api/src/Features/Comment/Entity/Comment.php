<?php

declare(strict_types=1);

namespace App\Features\Comment\Entity;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Features\Project\Entity\Screen;
use App\Features\RuleSet\Entity\Rule;
use App\Infrastructure\Doctrine\Entity\HasUuidInterface;
use App\Infrastructure\Doctrine\Entity\SerializableInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Safe\DateTimeImmutable;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'comment')]
class Comment implements HasUuidInterface, SerializableInterface
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

    #[ManyToOne(targetEntity: Screen::class)]
    #[JoinColumn(name: 'screen_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank(message: 'La page est obligatoire.')]
    private Screen $screen;

    #[ORM\Column(type: Types::TEXT)]
    private string $text;

    public function __construct(
        User $user,
        Rule $rule,
        Project $project,
        Screen $screen,
        string $text,
        // used for fixtures
        ?DateTimeImmutable $createdAt = null,
    ) {
        $this->uuid = Uuid::v4();
        $this->createdAt = $createdAt ?? new DateTimeImmutable();
        $this->updatedAt = $createdAt ?? new DateTimeImmutable();
        $this->user = $user;
        $this->rule = $rule;
        $this->project = $project;
        $this->screen = $screen;
        $this->text = $text;
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

    public function getDefaultFields(): array
    {
        return [
            'uuid',
            'createdAt',
            'text',
            'ruleUuid',
            'projectUuid',
            'screenUuid',
            'userUuid',
        ];
    }
}
