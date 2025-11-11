<?php

declare(strict_types=1);

namespace App\Features\Project\tests\Controller;

use App\Features\Project\Fixture\Story\ProjectsStory;
use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class GetProjectControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_get_a_project(): void
    {
        $response = $this->request(
            uri: '/api/projects/' . ProjectsStory::PROJECT_DEATH_STAR_UUID,
            method: Request::METHOD_GET,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            'uuid' => '@uuid@',
            'name' => 'Death Star',
            'createdAt' => '@datetime@',
            'updatedAt' => '@datetime@',
            'status' => 'in_progress',
            'progress' => 0,
            'screens' => [
                [
                    'uuid' => '@uuid@',
                    'name' => 'Home Screen',
                ],
                [
                    'uuid' => '@uuid@',
                    'name' => 'Contact Screen',
                ],
            ],
            'ruleSet' => [
                'uuid' => '@uuid@',
                'name' => 'IWSQA',
                'version' => '1.3.3.7',
            ],
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cant_get_a_project_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: '/api/projects/' . ProjectsStory::PROJECT_DEATH_STAR_UUID,
            method: Request::METHOD_GET,
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }
}
