<?php

declare(strict_types=1);

namespace App\Features\Healthcheck\tests\Controller;

use function Safe\json_decode;
use PHPUnit\Framework\Attributes\TestDox;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Webmozart\Assert\Assert;

final class HealthcheckControllerTest extends WebTestCase
{
    #[TestDox('It should return a proper healthcheck response')]
    public function testItShouldReturnAProperHealthcheckResponse(): void
    {
        $client = self::createClient();

        $client->request(Request::METHOD_GET, '/');

        /** @var Response $response */
        $response = $client->getResponse();

        self::assertResponseIsSuccessful();
        $this->assertSame('application/json', $response->headers->get('content-type'));

        Assert::string($response->getContent());
        $responseData = json_decode($response->getContent(), true);

        $this->assertSame([
            'healthcheck' => true,
        ], $responseData);
    }
}
