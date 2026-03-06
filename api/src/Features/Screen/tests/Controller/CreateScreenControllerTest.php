<?php

declare(strict_types=1);

namespace App\Features\Screen\tests\Controller;

use App\Features\Project\Fixture\Story\ProjectsStory;
use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Iterator;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class CreateScreenControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_can_add_a_screen(): void
    {
        $response = $this->request(
            uri: '/api/screens',
            method: Request::METHOD_POST,
            payload: [
                'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
                'name' => 'Ma nouvelle page',
                'url' => 'https://www.monprojet.empire/new-page',
                'rank' => 10,
            ],
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            'uuid' => '@uuid@',
            'name' => 'Ma nouvelle page',
            'url' => 'https://www.monprojet.empire/new-page',
            'rank' => 10,
            'isRoot' => false,
            'createdAt' => '@datetime@.after("today")',
            'updatedAt' => '@datetime@.after("today")',
            'progress' => 0,
            'complianceRate' => 0,
            'complianceCount' => 0,
            'issueCount' => 0,
            'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
        ], $response, Response::HTTP_CREATED);
    }

    public function test_it_cant_add_a_screen_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: '/api/screens',
            method: Request::METHOD_POST,
            payload: [
                'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
                'name' => 'Ma nouvelle page',
                'url' => 'https://www.monprojet.empire/new-page',
                'rank' => 10,
            ],
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);

        $response = $this->request(
            uri: '/api/screens',
            method: Request::METHOD_POST,
            payload: [
                'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
                'name' => 'Ma nouvelle page',
                'url' => 'https://www.monprojet.empire/new-page',
                'rank' => 10,
            ],
            authenticationToken: 'invalid_token',
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'Invalid JWT Token',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }

    public function test_it_cant_add_a_screen_on_a_project_i_dont_own(): void
    {
        $response = $this->request(
            uri: '/api/screens',
            method: Request::METHOD_POST,
            payload: [
                'projectUuid' => ProjectsStory::PROJECT_XWING_UUID,
                'name' => 'Ma nouvelle page',
                'url' => 'https://www.monprojet.empire/new-page',
                'rank' => 10,
            ],
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            'code' => 'not_found',
            'message' => 'Resource not found.',
        ], $response, Response::HTTP_NOT_FOUND);
    }

    /**
     * @param array<mixed> $payload
     * @param array<mixed> $expectedResponse
     */
    #[DataProvider('invalidScreenDataProvider')]
    public function test_it_cant_add_a_screen_with_invalid_data(
        array $payload,
        array $expectedResponse
    ): void {
        $response = $this->request(
            uri: '/api/screens',
            method: Request::METHOD_POST,
            payload: $payload,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseEquals($expectedResponse, $response, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public static function invalidScreenDataProvider(): Iterator
    {
        yield 'missing name field' => [
            [
                'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
                'url' => 'https://www.ratatouille.remake',
                'rank' => 12,
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'c1051bb4-d103-4f74-8988-acbcafc7fdc3',
                        'propertyPath' => 'name',
                        'message' => 'Le nom de la page est obligatoire.',
                    ],
                ],
            ],
        ];

        yield 'empty name' => [
            [
                'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
                'name' => '',
                'url' => 'https://www.ratatouille.remake',
                'rank' => 12,
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'c1051bb4-d103-4f74-8988-acbcafc7fdc3',
                        'propertyPath' => 'name',
                        'message' => 'Le nom de la page est obligatoire.',
                    ],
                ],
            ],
        ];

        yield 'missing projectUuid field' => [
            [
                'name' => 'Page secrète',
                'url' => 'https://www.ratatouille.remake',
                'rank' => 10,
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'c1051bb4-d103-4f74-8988-acbcafc7fdc3',
                        'propertyPath' => 'projectUuid',
                        'message' => "L'UUID du projet est obligatoire.",
                    ],
                ],
            ],
        ];

        yield 'missing rank field' => [
            [
                'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
                'name' => 'Ma nouvelle page',
                'url' => 'https://www.ratatouille.remake',
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'c1051bb4-d103-4f74-8988-acbcafc7fdc3',
                        'propertyPath' => 'rank',
                        'message' => 'Le rang de la page est obligatoire.',
                    ],
                ],
            ],
        ];
    }
}
