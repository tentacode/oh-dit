<?php

declare(strict_types=1);

namespace App\Features\Project\tests\Controller;

use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class GetProjectsControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_get_all_projects(): void
    {
        $response = $this->request(
            uri: '/api/projects',
            method: Request::METHOD_GET,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseLength(1, $response);

        $this->assertJsonResponseMatches([
            [
                'uuid' => '@uuid@',
                'name' => 'Death Star',
                'createdAt' => '@datetime@',
                'updatedAt' => '@datetime@',
                'status' => 'in_progress',
                'progress' => 0,
                'complianceRate' => 0,
                'screens' => [
                    [
                        'uuid' => '@uuid@',
                        'name' => 'Éléments transverses',
                        'progress' => 0,
                        'complianceRate' => 0,
                        'isRoot' => true,
                    ],
                    [
                        'uuid' => '@uuid@',
                        'name' => 'Home Screen',
                        'progress' => 0,
                        'complianceRate' => 0,
                        'isRoot' => false,
                    ],
                    [
                        'uuid' => '@uuid@',
                        'name' => 'Contact Screen',
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
            ],
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cant_get_all_projects_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: '/api/projects/',
            method: Request::METHOD_GET,
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }
}
