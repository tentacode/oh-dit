<?php

declare(strict_types=1);

namespace App\Features\Comment\tests\Controller;

use App\Features\Project\Fixture\Story\ProjectsStory;
use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class GetProjectCommentsTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_gets_a_project_comment(): void
    {
        $response = $this->request(
            uri: sprintf('/api/projects/%s/comments', ProjectsStory::PROJECT_DEATH_STAR_UUID),
            method: Request::METHOD_GET,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseLength(1, $response);

        $this->assertJsonResponseMatches(
            [
                [
                    'uuid' => '@uuid@',
                    'user_uuid' => '00000000-0000-4000-8000-000000000001',
                    'rule_uuid' => '12341234-2222-4000-8001-000000000001',
                    'project_uuid' => '22222222-0000-4000-8000-000000000001',
                    'screen_uuid' => '33333333-0000-4000-8000-000000000001',
                    'created_at' => '@datetime@',
                    'updated_at' => '@datetime@',
                    'text' => "Ces stormtroopers sont une honte pour l'Empire !",
                ],
            ],
            $response,
            Response::HTTP_OK
        );
    }

    public function test_it_cant_get_a_project_comments_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: sprintf('/api/projects/%s/comments', ProjectsStory::PROJECT_DEATH_STAR_UUID),
            method: Request::METHOD_GET,
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }

    public function test_it_cant_get_comments_on_a_project_i_dont_own(): void
    {
        $response = $this->request(
            uri: sprintf('/api/projects/%s/comments', ProjectsStory::PROJECT_DEATH_STAR_UUID),
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
