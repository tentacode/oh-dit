<?php

declare(strict_types=1);

namespace App\Features\Authentication\Entity;

use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\ManyToMany;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'team')]
#[UniqueEntity(fields: ['name'], message: 'There is already a team with this name')]
class Team
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private readonly Uuid $uuid;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank]
    private string $name;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private readonly DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private DateTimeImmutable $updatedAt;

    /**
     * @var Collection<int, User>
     */
    #[ManyToMany(targetEntity: User::class, inversedBy: 'teams')]
    #[ORM\JoinTable(
        name: 'team_user',
        joinColumns: [new ORM\JoinColumn(name: 'team_uuid', referencedColumnName: 'uuid')],
        inverseJoinColumns: [new ORM\JoinColumn(name: 'user_uuid', referencedColumnName: 'uuid')]
    )]
    private Collection $users;

    public function __construct(
        string $name,
        ?string $uuid = null
    ) {
        $this->uuid = $uuid ? Uuid::fromString($uuid) : Uuid::v4();
        $this->name = $name;
        $this->createdAt = CarbonImmutable::now();
        $this->updatedAt = CarbonImmutable::now();

        $this->users = new ArrayCollection();
    }

    public function getUuid(): Uuid
    {
        return $this->uuid;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): void
    {
        if (! $this->users->contains($user)) {
            $this->users->add($user);
        }
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
