<?php

declare(strict_types=1);

namespace App\Tests\Features\Healthcheck\Controller;

use PHPUnit\Framework\Attributes\TestDox;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

final class HealthcheckControllerTest extends WebTestCase
{
    #[TestDox('It should return a proper healthcheck response')]
    public function test_it_should_return_a_proper_healthcheck_response(): void
    {
        $client = self::createClient();
        
        $crawler = $client->request('GET', '/');
        
        /** @var Response $response */
        $response = $client->getResponse();
        
        self::assertResponseIsSuccessful();
        self::assertSame('application/json', $response->headers->get('content-type'));
        
        $responseData = json_decode($response->getContent(), true);
        
        self::assertSame(['healthcheck' => true], $responseData);
    }
} 