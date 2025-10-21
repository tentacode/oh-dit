<?php

declare(strict_types=1);

namespace App\Features\RuleSet\Entity;

use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'rule')]
class Rule
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private readonly Uuid $uuid;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    private string $shortDescription;

    #[ORM\Column(length: 180, nullable: true)]
    private string $prefix;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private readonly DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private DateTimeImmutable $updatedAt;

    #[ManyToOne(targetEntity: RuleCategory::class)]
    #[JoinColumn(name: 'rule_category_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank]
    private RuleCategory $ruleCategory;

    public function __construct(
        RuleCategory $ruleCategory,
        string $shortDescription,
        ?string $prefix = null,
        ?string $uuid = null
    ) {
        $this->uuid = $uuid ? Uuid::fromString($uuid) : Uuid::v4();
        $this->ruleCategory = $ruleCategory;
        $this->shortDescription = $shortDescription;
        $this->prefix = $prefix;
        $this->createdAt = CarbonImmutable::now();
        $this->updatedAt = CarbonImmutable::now();
    }

    public function getUuid(): Uuid
    {
        return $this->uuid;
    }

    public function getRuleCategory(): RuleCategory
    {
        return $this->ruleCategory;
    }

    public function getShortDescription(): string
    {
        return $this->shortDescription;
    }

    public function getPrefix(): ?string
    {
        return $this->prefix;
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
