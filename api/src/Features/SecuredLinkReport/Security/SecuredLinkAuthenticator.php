<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Webmozart\Assert\Assert;

final class SecuredLinkAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        private readonly JWTEncoderInterface $jwtEncoder,
    ) {
    }

    public function supports(Request $request): bool
    {
        // Handles all /api/secured-link/* routes except /login
        // which has its own password-based authentication logic
        return str_starts_with($request->getPathInfo(), '/api/secured-link/')
            && ! str_ends_with($request->getPathInfo(), '/login');
    }

    public function authenticate(Request $request): SelfValidatingPassport
    {
        $authHeader = $request->headers->get('Authorization');

        if ($authHeader === null || ! str_starts_with($authHeader, 'Bearer ')) {
            throw new AuthenticationException('Missing or invalid Authorization header');
        }

        $token = substr($authHeader, 7);

        try {
            $payload = $this->jwtEncoder->decode($token);
        } catch (JWTDecodeFailureException $e) {
            throw new AuthenticationException('Invalid or expired token');
        }

        if (($payload['type'] ?? null) !== 'secured_link_access') {
            throw new AuthenticationException('Invalid token type');
        }

        $securedLinkToken = $payload['secured_link_token'] ?? null;

        if ($securedLinkToken === null) {
            throw new AuthenticationException('Invalid token payload');
        }

        Assert::string($securedLinkToken);
        $securedLinkUser = new SecuredLinkUser($securedLinkToken);

        return new SelfValidatingPassport(
            new UserBadge($securedLinkUser->getUserIdentifier(), fn (): SecuredLinkUser => $securedLinkUser)
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // Continue to controller
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        return new JsonResponse(
            [
                'error' => $exception->getMessage(),
            ],
            Response::HTTP_UNAUTHORIZED
        );
    }
}
