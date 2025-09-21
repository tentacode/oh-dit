<?php

declare(strict_types=1);

namespace App\Features\Project\tests\Controller;

use function Safe\json_encode;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use PHPUnit\Framework\Attributes\TestDox;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class CreateProjectControllerTest extends WebTestCase
{
    use ResponseAssertions;

    #[TestDox('It can add a project')]
    public function test_it_can_add_a_project(): void
    {
        $client = self::createClient();

        $client->request(
            method: Request::METHOD_POST,
            uri: '/projects',
            content: json_encode([
                'name' => 'Mon nouveau projet',
            ])
        );

        /** @var Response $response */
        $response = $client->getResponse();

        $this->assertJsonResponseMatches([
            'id' => '@uuid@',
            'name' => 'Mon nouveau projet',
            'createdAt' => '@datetime@.after("today")',
            'updatedAt' => '@datetime@.after("today")',
        ], $response, Response::HTTP_CREATED);
    }

    // public function test_it_cant_add_a_project_if_not_logged_in()
    // {
    // }

    // public function test_it_cant_add_a_project_one_someone_elses_group()
    // {
    // }

    // public function test_it_cant_add_a_project_with_invalid_payload()
    // {
    // }

    // public function test_it_cant_add_a_project_with_empty_name()
    // {
    // }
}
