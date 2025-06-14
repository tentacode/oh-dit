<?php

declare(strict_types=1);

namespace App\Features\Healthcheck\tests\Controller;

use PHPUnit\Framework\Attributes\TestDox;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Webmozart\Assert\Assert;

final class HealthcheckControllerTest extends WebTestCase
{
    #[TestDox('It should return a proper healthcheck response')]
    public function testItShouldReturnAProperHealthcheckResponse(): void
    {
        $client = self::createClient();

        $crawler = $client->request('GET', '/');

        /** @var Response $response */
        $response = $client->getResponse();

        self::assertResponseIsSuccessful();
        self::assertSame('application/json', $response->headers->get('content-type'));

        Assert::string($response->getContent());
        $responseData = json_decode($response->getContent(), true);

        self::assertSame([
            'healthcheck' => true,
        ], $responseData);
    }
} 