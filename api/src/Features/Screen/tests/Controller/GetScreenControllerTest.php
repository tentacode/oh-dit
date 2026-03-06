<?php

declare(strict_types=1);

namespace App\Features\Screen\tests\Controller;

use App\Features\Project\Fixture\Story\ProjectsStory;
use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class GetScreenControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_get_a_screen(): void
    {
        $response = $this->request(
            uri: '/api/screens/' . ProjectsStory::SCREEN_HOME_UUID,
            method: Request::METHOD_GET,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            'uuid' => '@uuid@',
            'name' => 'Accueil',
            'url' => '/',
            'rank' => 1,
            'isRoot' => false,
            'createdAt' => '@datetime@',
            'updatedAt' => '@datetime@',
            'progress' => 0,
            'complianceRate' => 0,
            'issueCount' => 2,
            'complianceCount' => 4,
            'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cant_get_a_screen_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: '/api/screens/' . ProjectsStory::SCREEN_HOME_UUID,
            method: Request::METHOD_GET,
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }

    public function test_it_cant_get_a_screen_i_dont_own(): void
    {
        $response = $this->request(
            uri: '/api/screens/' . ProjectsStory::SCREEN_HOME_UUID,
            method: Request::METHOD_GET,
            authenticationToken: $this->getAuthenticationToken(
                email: 'luke@rebels.com',
                password: 'luke69420',
            ),
        );

        $this->assertJsonResponseMatches([
            'code' => 'not_found',
            'message' => 'Resource not found.',
        ], $response, Response::HTTP_NOT_FOUND);
    }
}
