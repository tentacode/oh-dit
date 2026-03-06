<?php

declare(strict_types=1);

namespace App\Features\Screen\tests\Controller;

use App\Features\Authentication\Fixture\Story\TeamUsersStory;
use App\Features\Project\Fixture\Story\ProjectsStory;
use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Iterator;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class PatchScreenControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_can_patch_a_screen(): void
    {
        $response = $this->request(
            uri: '/api/screens/' . ProjectsStory::SCREEN_HOME_UUID,
            method: Request::METHOD_PATCH,
            payload: [
                'name' => 'Page secrète',
                'url' => '/secret-page',
                'rank' => 10,
            ],
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            'uuid' => '@uuid@',
            'name' => 'Page secrète',
            'url' => '/secret-page',
            'isRoot' => false,
            'createdAt' => '@datetime@.after("today")',
            'updatedAt' => '@datetime@.after("today")',
            'progress' => 0,
            'complianceRate' => 0,
            'issueCount' => 2,
            'complianceCount' => 4,
            'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
            'rank' => 10,
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cant_patch_a_screen_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: '/api/screens/' . ProjectsStory::SCREEN_HOME_UUID,
            method: Request::METHOD_PATCH,
            payload: [
                'name' => 'Page secrète',
                'url' => '/secret-page',
                'rank' => 10,
            ],
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);

        $response = $this->request(
            uri: '/api/screens/' . ProjectsStory::SCREEN_HOME_UUID,
            method: Request::METHOD_PATCH,
            payload: [
                'name' => 'Page secrète',
                'url' => '/secret-page',
                'rank' => 10,
            ],
            authenticationToken: 'invalid_token',
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'Invalid JWT Token',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }

    public function test_it_cant_patch_a_screen_that_i_dont_own(): void
    {
        $response = $this->request(
            uri: '/api/screens/' . ProjectsStory::SCREEN_HOME_UUID,
            method: Request::METHOD_PATCH,
            payload: [
                'name' => 'Page secrète',
                'url' => '/secret-page',
                'rank' => 10,
            ],
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

    /**
     * @param array<mixed> $payload
     * @param array<mixed> $expectedResponse
     */
    #[DataProvider('invalidScreenDataProvider')]
    public function test_it_cant_patch_a_screen_with_invalid_data(
        array $payload,
        array $expectedResponse,
        int $expectedStatusCode
    ): void {
        $response = $this->request(
            uri: '/api/screens/' . ProjectsStory::SCREEN_HOME_UUID,
            method: Request::METHOD_PATCH,
            payload: $payload,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseEquals($expectedResponse, $response, $expectedStatusCode);
    }

    public static function invalidScreenDataProvider(): Iterator
    {
        yield 'empty name' => [
            [
                'name' => '',
                'url' => 'https://www.ratatouille.remake',
                'rank' => 10,
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
            Response::HTTP_UNPROCESSABLE_ENTITY,
        ];

        yield 'empty rank field' => [
            [
                'name' => 'Page secrète',
                'url' => 'https://www.ratatouille.remake',
                'rank' => '',
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => null,
                        'propertyPath' => 'rank',
                        'message' => 'Cette valeur doit être de type int|null.',
                    ],
                ],
            ],
            Response::HTTP_UNPROCESSABLE_ENTITY,
        ];

        yield 'invalid field' => [
            [
                'name' => 'Ratatouille remake',
                'url' => 'https://www.ratatouille.remake',
                'teamUuid' => TeamUsersStory::TEAM_THE_EMPIRE_UUID,
                'rank' => 10,
            ],
            [
                'code' => 'bad_request',
                'message' => 'Unexpected field(s): teamUuid.',
            ],
            Response::HTTP_BAD_REQUEST,
        ];
    }
}
