<?php

declare(strict_types=1);

namespace App\Infrastructure\PHPUnit;

use function Safe\json_decode;
use function Safe\json_encode;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;
use Webmozart\Assert\Assert;

trait LoginRequest
{
    protected function getAuthenticationToken(string $email, string $password): string
    {
        try {
            $client = self::getClient();
        } catch (Throwable) {
            $client = self::createClient();
        }

        Assert::notNull($client);

        $client->request(
            method: Request::METHOD_POST,
            uri: '/api/login_check',
            server: [
                'CONTENT_TYPE' => 'application/json',
            ],
            content: json_encode([
                'email' => $email,
                'password' => $password,
            ])
        );

        $response = $client->getResponse();
        Assert::isInstanceOf($response, Response::class);
        $this->assertSame(Response::HTTP_OK, $response->getStatusCode(), 'Authentication request failed.');

        $data = json_decode($response->getContent() ?: '', true);
        Assert::isArray($data);
        $token = $data['token'] ?? null;
        Assert::notNull($token, 'Authentication token not found in response.');
        Assert::stringNotEmpty($token);

        return $token;
    }
}
