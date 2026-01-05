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
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'rule_category')]
class RuleCategory implements HasUuidInterface
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[Assert\Uuid(message: 'L\'UUID de la catégorie doit être un UUID valide.')]
    private Uuid $uuid;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank(message: 'Le nom de la catégorie est obligatoire.')]
    private string $name;

    #[ORM\Column(length: 180, nullable: true)]
    private ?string $prefix;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private readonly DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private DateTimeImmutable $updatedAt;

    #[ManyToOne(targetEntity: RuleSet::class)]
    #[JoinColumn(name: 'rule_set_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank]
    private RuleSet $ruleSet;

    /**
     * @var Collection<int, Rule>
     */
    #[ORM\OneToMany(targetEntity: Rule::class, mappedBy: 'ruleCategory')]
    #[ORM\OrderBy([
        'prefix' => 'ASC',
    ])]
    private Collection $rules;

    public function __construct(
        RuleSet $ruleSet,
        string $name,
        ?string $prefix = null,
        ?string $uuid = null
    ) {
        $this->uuid = $uuid ? Uuid::fromString($uuid) : Uuid::v4();
        $this->ruleSet = $ruleSet;
        $this->name = $name;
        $this->prefix = in_array($prefix, [null, '', '0'], true) ? null : $prefix;
        $this->rules = new ArrayCollection();
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

    public function getPrefix(): ?string
    {
        return $this->prefix;
    }

    public function getRuleSet(): RuleSet
    {
        return $this->ruleSet;
    }

    /**
     * @return Collection<int, Rule>
     */
    public function getRules(): Collection
    {
        /** @var Rule[] $rules */
        $rules = $this->rules->toArray();
        usort(
            $rules,
            fn (Rule $a, Rule $b): int =>
            version_compare($a->getPrefix() ?? '', $b->getPrefix() ?? '')
        );

        return new ArrayCollection($rules);
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
