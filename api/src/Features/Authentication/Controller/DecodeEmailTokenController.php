<?php

declare(strict_types=1);

namespace App\Features\Authentication\Controller;

use function Safe\base64_decode;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Webmozart\Assert\Assert;

class DecodeEmailTokenRequest
{
    public function __construct(
        public string $token,
    ) {
    }
}

class DecodeEmailTokenController extends ApiController
{
    public function __construct(
    ) {
    }

    #[Route('/api/register/decode-email-token', name: 'decode_email_token', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload()]
        DecodeEmailTokenRequest $decodeEmailTokenRequest,
    ): JsonResponse {
        return new JsonResponse([
            'email' => $this->decodeToken($decodeEmailTokenRequest->token),
        ]);
    }

    private function decodeToken(string $token): string
    {
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            throw new SuspiciousOperationException('Invalid token format.');
        }

        [$payload, $signature] = $parts;

        Assert::string($_SERVER['APP_SECRET'], 'APP_SECRET is not set in server variables.');

        $expectedSignature = hash_hmac('sha256', $payload, $_SERVER['APP_SECRET']);

        if (! hash_equals($expectedSignature, $signature)) {
            throw new SuspiciousOperationException('Invalid token signature.');
        }

        return base64_decode($payload, true);
    }
}
