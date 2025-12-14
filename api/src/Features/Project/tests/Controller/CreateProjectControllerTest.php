<?php

declare(strict_types=1);

namespace App\Features\Project\tests\Controller;

use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Iterator;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class CreateProjectControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_can_add_a_project(): void
    {
        $response = $this->request(
            uri: '/api/projects',
            method: Request::METHOD_POST,
            payload: [
                'name' => 'Mon nouveau projet',
                'screens' => [
                    'Page 1',
                    'Page 2',
                ],
            ],
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            'uuid' => '@uuid@',
            'name' => 'Mon nouveau projet',
            'createdAt' => '@datetime@.after("today")',
            'updatedAt' => '@datetime@.after("today")',
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
                    'name' => 'Page 1',
                    'progress' => 0,
                    'complianceRate' => 0,
                    'isRoot' => false,
                ],
                [
                    'uuid' => '@uuid@',
                    'name' => 'Page 2',
                    'progress' => 0,
                    'complianceRate' => 0,
                    'isRoot' => false,
                ],
            ],
            'ruleSet' => [
                'uuid' => '@uuid@',
                'name' => 'RGAA',
                'version' => '4.1.2',
            ],
        ], $response, Response::HTTP_CREATED);
    }

    public function test_it_cant_add_a_project_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: '/api/projects',
            method: Request::METHOD_POST,
            payload: [
                'name' => 'Mon nouveau projet',
                'screens' => [
                    'Page 1',
                    'Page 2',
                ],
            ],
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);

        $response = $this->request(
            uri: '/api/projects',
            method: Request::METHOD_POST,
            payload: [
                'name' => 'Mon nouveau projet',
                'screens' => [
                    'Page 1',
                    'Page 2',
                ],
            ],
            authenticationToken: 'invalid_token',
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'Invalid JWT Token',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @param array<mixed> $payload
     * @param array<mixed> $expectedResponse
     */
    #[DataProvider('invalidProjectDataProvider')]
    public function test_it_cant_add_a_project_with_invalid_data(
        array $payload,
        array $expectedResponse
    ): void {
        $response = $this->request(
            uri: '/api/projects',
            method: Request::METHOD_POST,
            payload: $payload,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseEquals($expectedResponse, $response, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public static function invalidProjectDataProvider(): Iterator
    {
        yield 'missing name field' => [
            [
                'project' => 'Ratatouille remake',
                'screens' => [
                    'Page 1',
                    'Page 2',
                ],
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'c1051bb4-d103-4f74-8988-acbcafc7fdc3',
                        'propertyPath' => 'name',
                        'message' => 'Le nom du projet est obligatoire.',
                    ],
                ],
            ],
        ];

        yield 'empty name' => [
            [
                'name' => '',
                'screens' => [
                    'Page 1',
                    'Page 2',
                ],
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'c1051bb4-d103-4f74-8988-acbcafc7fdc3',
                        'propertyPath' => 'name',
                        'message' => 'Le nom du projet est obligatoire.',
                    ],
                ],
            ],
        ];

        yield 'no screens' => [
            [
                'name' => 'New Project',
                'screens' => [],
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'bef8e338-6ae5-4caf-b8e2-50e7b0579e69',
                        'propertyPath' => 'screens',
                        'message' => 'Au moins une page est requise.',
                    ],
                ],
            ],
        ];

        yield 'empty screens' => [
            [
                'name' => 'New Project',
                'screens' => ['Page 1', ''],
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'c1051bb4-d103-4f74-8988-acbcafc7fdc3',
                        'propertyPath' => 'screens[1]',
                        'message' => 'Le nom de la page ne peut pas être vide.',
                    ],
                ],
            ],
        ];
    }
}
