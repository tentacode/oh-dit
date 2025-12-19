<?php

declare(strict_types=1);

namespace App\Features\Authentication\tests\Controller;

use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class GetTeamsControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_get_all_teams(): void
    {
        $response = $this->request(
            uri: '/api/teams',
            method: Request::METHOD_GET,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseLength(2, $response);

        $this->assertJsonResponseMatches([
            [
                'uuid' => '11111111-0000-4000-8000-000000000003',
                'name' => 'Les chatons mignons',
            ],
            [
                'uuid' => '11111111-0000-4000-8000-000000000001',
                'name' => 'The Empire',
            ],
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cant_get_all_teams_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: '/api/teams/',
            method: Request::METHOD_GET,
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }
}
