<?php

declare(strict_types=1);

namespace App\Features\RuleSet\Entity;

use App\Infrastructure\Doctrine\Entity\HasUuidInterface;
use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'rule_set')]
class RuleSet implements HasUuidInterface
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private readonly Uuid $uuid;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    private string $name;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank]
    private string $description;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    private string $version;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private readonly DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private DateTimeImmutable $updatedAt;

    /**
     * @var Collection<int, RuleCategory>
     */
    #[ORM\OneToMany(targetEntity: RuleCategory::class, mappedBy: 'ruleSet')]
    private Collection $ruleCategories;

    public function __construct(
        string $name,
        string $description,
        string $version,
        ?string $uuid = null
    ) {
        $this->uuid = $uuid ? Uuid::fromString($uuid) : Uuid::v4();
        $this->name = $name;
        $this->description = $description;
        $this->version = $version;
        $this->ruleCategories = new ArrayCollection();
        $this->createdAt = CarbonImmutable::now();
        $this->updatedAt = CarbonImmutable::now();
    }

    public function getUuid(): Uuid
    {
        return $this->uuid;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getVersion(): string
    {
        return $this->version;
    }

    /**
     * @return Collection<int, RuleCategory>
     */
    public function getRuleCategories(): Collection
    {
        return $this->ruleCategories;
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
