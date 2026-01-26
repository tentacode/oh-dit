<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Query;

use App\Features\Project\Entity\Project;
use Carbon\Carbon;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use RuntimeException;
use Webmozart\Assert\Assert;

final class LoginSecuredLinkQuery
{
    // JWT validity duration: 7 days
    private const JWT_TTL_SECONDS = 7 * 24 * 60 * 60;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly JWTEncoderInterface $jwtEncoder,
    ) {
    }

    public function __invoke(string $securedLinkToken, LoginSecuredLinkRequest $request): string
    {
        $project = $this->entityManager->getRepository(Project::class)->findOneBy([
            'securedLinkToken' => $securedLinkToken,
        ]);

        Assert::notNull($project);

        $passwordHash = $project->getSecuredLinkPasswordHash();
        Assert::notNull($passwordHash);

        if (! password_verify($request->password, $passwordHash)) {
            throw new RuntimeException('Password does not match');
        }

        $payload = [
            'type' => 'secured_link_access',
            'secured_link_token' => $securedLinkToken,
            'exp' => Carbon::now()->getTimestamp() + self::JWT_TTL_SECONDS,
        ];

        return $this->jwtEncoder->encode($payload);
    }
}
