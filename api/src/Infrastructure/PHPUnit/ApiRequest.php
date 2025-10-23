<?php

declare(strict_types=1);

namespace App\Infrastructure\PHPUnit;

use function Safe\json_encode;
use Symfony\Component\HttpFoundation\Response;
use Throwable;
use Webmozart\Assert\Assert;

trait ApiRequest
{
    /**
     * @param array<mixed> $payload
     */
    protected function request(
        string $uri,
        string $method,
        array $payload = [],
        string $authenticationToken = '',
    ): Response {
        try {
            $client = self::getClient();
        } catch (Throwable) {
            $client = self::createClient();
        }

        $client->followRedirects(true);

        Assert::notNull($client);

        $server = [
            'CONTENT_TYPE' => 'application/json',
        ];

        if ($authenticationToken !== '') {
            $server['HTTP_AUTHORIZATION'] = 'Bearer ' . $authenticationToken;
        }

        $client->request(
            method: $method,
            uri: $uri,
            server: $server,
            content: json_encode($payload)
        );

        $response = $client->getResponse();
        Assert::isInstanceOf($response, Response::class);

        return $response;
    }
}
