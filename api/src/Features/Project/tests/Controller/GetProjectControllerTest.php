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
            'url' => 'https://www.deathstar.empire',
            'createdAt' => '@datetime@',
            'updatedAt' => '@datetime@',
            'status' => 'in_progress',
            'progress' => 0,
            'complianceRate' => 0,
            'securedLinkToken' => null,
            'screens' => [
                [
                    'uuid' => '@uuid@',
                    'name' => 'Éléments transverses',
                    'url' => '',
                    'rank' => 0,
                    'progress' => 0,
                    'complianceRate' => 0,
                    'isRoot' => true,
                ],
                [
                    'uuid' => '@uuid@',
                    'name' => 'Accueil',
                    'url' => '/',
                    'rank' => 1,
                    'progress' => 0,
                    'complianceRate' => 0,
                    'isRoot' => false,
                ],
                [
                    'uuid' => '@uuid@',
                    'name' => 'Contact',
                    'url' => '/contact',
                    'rank' => 2,
                    'progress' => 0,
                    'complianceRate' => 0,
                    'isRoot' => false,
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

    public function test_it_cant_get_a_project_i_dont_own(): void
    {
        $response = $this->request(
            uri: '/api/projects/' . ProjectsStory::PROJECT_DEATH_STAR_UUID,
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
