<?php

declare(strict_types=1);

namespace App\Features\Issue\tests\Controller;

use App\Features\Authentication\Fixture\Story\TeamUsersStory;
use App\Features\Project\Fixture\Story\ProjectsStory;
use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class GetProjectIssuesTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_gets_a_project_issues(): void
    {
        $response = $this->request(
            uri: sprintf('/api/projects/%s/issues', ProjectsStory::PROJECT_DEATH_STAR_UUID),
            method: Request::METHOD_GET,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseLength(2, $response);

        $this->assertJsonResponseMatches([
            [
                'uuid' => '@uuid@',
                'ruleUuid' => '@uuid@',
                'userUuid' => TeamUsersStory::USER_DARTH_VADER_UUID,
                'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
                'screenUuid' => ProjectsStory::SCREEN_HOME_UUID,
                'issueId' => 1338,
                'severity' => 'moderate',
                'status' => 'fixed',
                'statusUpdatedAt' => '@datetime@',
                'statusUpdatedBy' => TeamUsersStory::USER_DARTH_VADER_UUID,
                'statusChangeHistory' => [
                    [
                        'status' => 'fixed',
                        'statusUpdatedAt' => '@datetime@',
                        'statusUpdatedBy' => TeamUsersStory::USER_DARTH_VADER_UUID,
                    ],
                ],
                'createdAt' => '@datetime@',
                'updatedAt' => '@datetime@',
                'text' => 'Les stormtroopers ne portent pas correctement leur casque dans 30% des cas.',
            ],
            [
                'uuid' => '@uuid@',
                'ruleUuid' => '@uuid@',
                'userUuid' => TeamUsersStory::USER_DARTH_VADER_UUID,
                'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
                'screenUuid' => ProjectsStory::SCREEN_HOME_UUID,
                'issueId' => 1337,
                'severity' => 'blocking',
                'status' => 'pending',
                'statusUpdatedAt' => '@datetime@',
                'statusUpdatedBy' => TeamUsersStory::USER_DARTH_VADER_UUID,
                'statusChangeHistory' => [
                    [
                        'status' => 'pending',
                        'statusUpdatedAt' => '@datetime@',
                        'statusUpdatedBy' => TeamUsersStory::USER_DARTH_VADER_UUID,
                    ],
                ],
                'createdAt' => '@datetime@',
                'updatedAt' => '@datetime@',
                'text' => '@string@',
            ],
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cant_get_a_project_issues_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: sprintf('/api/projects/%s/issues', ProjectsStory::PROJECT_DEATH_STAR_UUID),
            method: Request::METHOD_GET,
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }

    public function test_it_cant_get_issues_on_a_project_i_dont_own(): void
    {
        $response = $this->request(
            uri: sprintf('/api/projects/%s/issues', ProjectsStory::PROJECT_DEATH_STAR_UUID),
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
