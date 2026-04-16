<?php

declare(strict_types=1);

namespace App\Features\Team\Entity;

use App\Features\Authentication\Entity\Team;
use App\Features\Authentication\Entity\User;
use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'invite')]
class Invite
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[Assert\Uuid(message: 'L\'UUID de l\'invitation doit être un UUID valide.')]
    private Uuid $uuid;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank(message: "L'email de l'invitation est obligatoire.")]
    private string $cryptedEmail;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private readonly DateTimeImmutable $createdAt;

    #[ManyToOne(targetEntity: Team::class)]
    #[JoinColumn(name: 'team_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank]
    private Team $team;

    #[ManyToOne(targetEntity: User::class)]
    #[JoinColumn(name: 'created_by_uuid', referencedColumnName: 'uuid')]
    #[Assert\NotBlank]
    private User $createdBy;

    public function __construct(
        string $cryptedEmail,
        Team $team,
        User $createdBy,
        ?string $uuid = null
    ) {
        $this->uuid = $uuid ? Uuid::fromString($uuid) : Uuid::v4();
        $this->cryptedEmail = $cryptedEmail;
        $this->team = $team;
        $this->createdBy = $createdBy;
        $this->createdAt = CarbonImmutable::now();
    }

    public function getUuid(): Uuid
    {
        return $this->uuid;
    }

    public function getTeam(): Team
    {
        return $this->team;
    }

    public function getCreatedBy(): User
    {
        return $this->createdBy;
    }

    public function getCryptedEmail(): string
    {
        return $this->cryptedEmail;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }
}
