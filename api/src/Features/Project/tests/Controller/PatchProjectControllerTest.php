<?php

declare(strict_types=1);

namespace App\Features\Project\tests\Controller;

use App\Features\Authentication\Fixture\Story\TeamUsersStory;
use App\Features\Project\Fixture\Story\ProjectsStory;
use App\Features\RuleSet\Fixture\Story\RuleSetsStory;
use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Iterator;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class PatchProjectControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_can_patch_a_project(): void
    {
        $response = $this->request(
            uri: '/api/projects/' . ProjectsStory::PROJECT_DEATH_STAR_UUID,
            method: Request::METHOD_PATCH,
            payload: [
                'name' => 'Death Star 2',
                'url' => 'https://www.deathstar2.empire',
            ],
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            'uuid' => '@uuid@',
            'name' => 'Death Star 2',
            'url' => 'https://www.deathstar2.empire',
            'createdAt' => '@datetime@.after("today")',
            'updatedAt' => '@datetime@.after("today")',
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
                '@...@',
            ],
            'ruleSet' => [
                'uuid' => RuleSetsStory::RULE_SET_EMPIRE_UUID,
                'name' => 'IWSQA',
                'version' => '1.3.3.7',
            ],
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cant_patch_a_project_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: '/api/projects/' . ProjectsStory::PROJECT_DEATH_STAR_UUID,
            method: Request::METHOD_PATCH,
            payload: [
                'name' => 'Death Star 2',
                'url' => 'https://www.deathstar2.empire',
            ],
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);

        $response = $this->request(
            uri: '/api/projects/' . ProjectsStory::PROJECT_DEATH_STAR_UUID,
            method: Request::METHOD_PATCH,
            payload: [
                'name' => 'Death Star 2',
                'url' => 'https://www.deathstar2.empire',
            ],
            authenticationToken: 'invalid_token',
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'Invalid JWT Token',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }

    public function test_it_can_patch_a_project_that_i_dont_own(): void
    {
        $response = $this->request(
            uri: '/api/projects/' . ProjectsStory::PROJECT_XWING_UUID,
            method: Request::METHOD_PATCH,
            payload: [
                'name' => 'Death Star 2',
                'url' => 'https://www.deathstar2.empire',
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
    #[DataProvider('invalidProjectDataProvider')]
    public function test_it_cant_patch_a_project_with_invalid_data(
        array $payload,
        array $expectedResponse,
        int $expectedStatusCode
    ): void {
        $response = $this->request(
            uri: '/api/projects/' . ProjectsStory::PROJECT_DEATH_STAR_UUID,
            method: Request::METHOD_PATCH,
            payload: $payload,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseEquals($expectedResponse, $response, $expectedStatusCode);
    }

    public static function invalidProjectDataProvider(): Iterator
    {
        yield 'empty name' => [
            [
                'name' => '',
                'url' => 'https://www.ratatouille.remake',
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
            Response::HTTP_UNPROCESSABLE_ENTITY,
        ];

        yield 'invalid field' => [
            [
                'status' => 'done',
                'name' => 'Ratatouille remake',
                'url' => 'https://www.ratatouille.remake',
                'teamUuid' => TeamUsersStory::TEAM_THE_EMPIRE_UUID,
            ],
            [
                'code' => 'bad_request',
                'message' => 'Unexpected field(s): status, teamUuid.',
            ],
            Response::HTTP_BAD_REQUEST,
        ];
    }
}
