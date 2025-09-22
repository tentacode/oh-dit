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
            ],
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth.vader@empire.com',
                password: 'darth_vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            'id' => '@uuid@',
            'name' => 'Mon nouveau projet',
            'createdAt' => '@datetime@.after("today")',
            'updatedAt' => '@datetime@.after("today")',
        ], $response, Response::HTTP_CREATED);
    }

    public function test_it_cant_add_a_project_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: '/api/projects',
            method: Request::METHOD_POST,
            payload: [
                'name' => 'Mon nouveau projet',
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
    #[DataProvider('emptyProjectNameProvider')]
    public function test_it_cant_add_a_project_with_invalid_name(
        array $payload,
        array $expectedResponse
    ): void {
        $response = $this->request(
            uri: '/api/projects',
            method: Request::METHOD_POST,
            payload: $payload,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth.vader@empire.com',
                password: 'darth_vader_64',
            ),
        );

        $this->assertJsonResponseEquals($expectedResponse, $response, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public static function emptyProjectNameProvider(): Iterator
    {
        yield 'missing name field' => [
            [
                'project' => 'Ratatouille remake',
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'c1051bb4-d103-4f74-8988-acbcafc7fdc3',
                        'propertyPath' => 'name',
                        'message' => 'Project name is required',
                    ],
                ],
            ],
        ];

        yield 'empty name' => [
            [
                'name' => '',
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'c1051bb4-d103-4f74-8988-acbcafc7fdc3',
                        'propertyPath' => 'name',
                        'message' => 'Project name is required',
                    ],
                ],
            ],
        ];
    }
}
