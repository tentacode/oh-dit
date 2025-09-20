<?php

declare(strict_types=1);

namespace App\Features\Project\tests\Controller;

use function Safe\json_decode;
use function Safe\json_encode;
use PHPUnit\Framework\Attributes\TestDox;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Webmozart\Assert\Assert;

final class CreateProjectControllerTest extends WebTestCase
{
    #[TestDox('It can add a project')]
    public function test_it_can_add_a_project(): void
    {
        $client = self::createClient();

        $client->request(
            method: Request::METHOD_POST,
            uri: '/projects',
            content: json_encode([
                'name' => 'Mon nouveau projet',
            ]) // @TODO safe ?
        );

        /** @var Response $response */
        $response = $client->getResponse();

        self::assertResponseIsSuccessful();
        $this->assertSame('application/json', $response->headers->get('content-type'));

        // @TODO phpmatcher

        Assert::string($response->getContent());
        $responseData = json_decode($response->getContent(), true);

        $this->assertSame([
            'id' => '1234',
            'name' => 'Mon nouveau projet',
            'created_at' => '2025-06-12 13:37:42',
            'updated_at' => '2025-06-12 13:37:42',
        ], $responseData);
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
