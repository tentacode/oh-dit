<?php

declare(strict_types=1);

namespace App\Features\Project\tests\Controller;

use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class UpdateProjectMetricsControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_updates_project_metrics(): void
    {
        $response = $this->request(
            uri: '/api/compliances',
            method: Request::METHOD_POST,
            payload: [
                'projectUuid' => '22222222-0000-4000-8000-000000000001',
                'screenUuid' => '33333333-0000-4000-8000-000000000001',
                'ruleUuid' => '12341234-2222-4000-8002-000000000005',
                'status' => 'non_compliant',
            ],
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            'uuid' => '@uuid@',
            'createdAt' => '@datetime@',
            'status' => 'non_compliant',
            'ruleUuid' => '12341234-2222-4000-8002-000000000005',
            'screenUuid' => '33333333-0000-4000-8000-000000000001',
            'projectUuid' => '22222222-0000-4000-8000-000000000001',
            'userUuid' => '00000000-0000-0000-0000-000000000001',
        ], $response, Response::HTTP_CREATED);

        $response = $this->request(
            uri: '/api/projects/22222222-0000-4000-8000-000000000001/update-metrics',
            method: Request::METHOD_POST,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            'uuid' => '22222222-0000-4000-8000-000000000001',
            'name' => 'Death Star',
            'createdAt' => '@datetime@',
            'updatedAt' => '@datetime@',
            'status' => 'in_progress',
            'progress' => 5,
            'complianceRate' => 50,
            'screens' => [
                [
                    'uuid' => '33333333-0000-4000-8000-000000000000',
                    'name' => 'Éléments transverses',
                    'progress' => 0,
                    'complianceRate' => 0,
                    'isRoot' => true,
                ],
                [
                    'uuid' => '33333333-0000-4000-8000-000000000001',
                    'name' => 'Home Screen',
                    'progress' => 13,
                    'complianceRate' => 33,
                    'isRoot' => false,
                ],
                [
                    'uuid' => '33333333-0000-4000-8000-000000000002',
                    'name' => 'Contact Screen',
                    'progress' => 3,
                    'complianceRate' => 0,
                    'isRoot' => false,
                ],
            ],
            'ruleSet' => [
                'uuid' => '@uuid@',
                'name' => 'IWSQA',
                'version' => '1.3.3.7',
            ],
        ], $response);
    }

    public function test_it_cant_update_metrics_if_not_logged_in(): void
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
