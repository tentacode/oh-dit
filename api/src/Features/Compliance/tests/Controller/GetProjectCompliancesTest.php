<?php

declare(strict_types=1);

namespace App\Features\Compliance\tests\Controller;

use App\Features\Project\Fixture\Story\ProjectsStory;
use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class GetProjectCompliancesTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_gets_a_project_compliance(): void
    {
        $response = $this->request(
            uri: sprintf('/api/projects/%s/compliances', ProjectsStory::PROJECT_DEATH_STAR_UUID),
            method: Request::METHOD_GET,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseLength(3, $response);

        $this->assertJsonResponseMatches([
            [
                'uuid' => '@uuid@',
                'ruleUuid' => '@uuid@',
                'userUuid' => '@uuid@',
                'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
                'screenUuid' => ProjectsStory::SCREEN_HOME_UUID,
                'status' => 'non_compliant',
                'createdAt' => '@datetime@',
            ],
            [
                'uuid' => '@uuid@',
                'ruleUuid' => '@uuid@',
                'userUuid' => '@uuid@',
                'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
                'screenUuid' => ProjectsStory::SCREEN_HOME_UUID,
                'status' => 'compliant',
                'createdAt' => '@datetime@',
            ],
            [
                'uuid' => '@uuid@',
                'ruleUuid' => '@uuid@',
                'userUuid' => '@uuid@',
                'projectUuid' => ProjectsStory::PROJECT_DEATH_STAR_UUID,
                'screenUuid' => ProjectsStory::SCREEN_HOME_UUID,
                'status' => 'not_applicable',
                'createdAt' => '@datetime@',
            ],
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cant_get_a_project_compliances_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: sprintf('/api/projects/%s/compliances', ProjectsStory::PROJECT_DEATH_STAR_UUID),
            method: Request::METHOD_GET,
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }
}
