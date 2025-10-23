<?php

declare(strict_types=1);

namespace App\Features\Newsletter\Entity;

use App\Infrastructure\Doctrine\Entity\HasUuidInterface;
use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'newsletter')]
#[UniqueEntity(fields: ['email'], message: 'There is already a newsletter with this email')]
class Newsletter implements HasUuidInterface
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private readonly Uuid $uuid;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\Email]
    #[Assert\NotBlank]
    private string $email;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $consentNewsletter;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $consentBlog;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $consentBeta;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private readonly DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private DateTimeImmutable $updatedAt;

    public function __construct(
        string $email,
        bool $consentNewsletter,
        bool $consentBlog,
        bool $consentBeta,
        ?string $uuid = null
    ) {
        $this->uuid = $uuid ? Uuid::fromString($uuid) : Uuid::v4();
        $this->email = $email;
        $this->consentNewsletter = $consentNewsletter;
        $this->consentBlog = $consentBlog;
        $this->consentBeta = $consentBeta;
        $this->createdAt = CarbonImmutable::now();
        $this->updatedAt = CarbonImmutable::now();
    }

    public function getUuid(): Uuid
    {
        return $this->uuid;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getConsentNewsletter(): bool
    {
        return $this->consentNewsletter;
    }

    public function getConsentBlog(): bool
    {
        return $this->consentBlog;
    }

    public function getConsentBeta(): bool
    {
        return $this->consentBeta;
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
