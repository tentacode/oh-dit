<?php

declare(strict_types=1);

namespace App\Features\Authentication\tests\Controller;

use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Iterator;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class ForgotPasswordControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_can_request_password_reset(): void
    {
        $response = $this->request(
            uri: '/api/forgot_password',
            method: Request::METHOD_POST,
            payload: [
                'email' => 'darth_vader@empire.com',
            ],
        );

        $this->assertJsonResponseMatches([
            'reset_password_url' => 'http://localhost:1339/reset-mot-de-passe?token=@string@',
            'token' => '@string@',
        ], $response, Response::HTTP_OK);
    }

    public function test_it_has_an_ok_response_even_if_email_does_not_exist(): void
    {
        $response = $this->request(
            uri: '/api/forgot_password',
            method: Request::METHOD_POST,
            payload: [
                'email' => 'kikoulol@empire.com',
            ],
        );

        $this->assertJsonResponseMatches([], $response, Response::HTTP_OK);
    }

    /**
     * @param array<mixed> $payload
     * @param array<mixed> $expectedResponse
     */
    #[DataProvider('invalidEmailProvider')]
    public function test_it_cant_request_password_with_invalid_email(
        array $payload,
        array $expectedResponse,
        int $expectedStatusCode,
    ): void {
        $response = $this->request(
            uri: '/api/forgot_password',
            method: Request::METHOD_POST,
            payload: $payload,
        );

        $this->assertJsonResponseEquals($expectedResponse, $response, $expectedStatusCode);
    }

    public static function invalidEmailProvider(): Iterator
    {
        yield 'wrong email' => [
            [
                'email' => 'darth_vader',
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'bd79c0ab-ddba-46cc-a703-a7a4b08de310',
                        'message' => "L'email doit être une adresse email valide.",
                        'propertyPath' => 'email',
                    ],
                ],
            ],
            Response::HTTP_UNPROCESSABLE_ENTITY,
        ];

        yield 'missing email' => [
            [
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'c1051bb4-d103-4f74-8988-acbcafc7fdc3',
                        'message' => "L'email est obligatoire.",
                        'propertyPath' => 'email',
                    ],
                ],
            ],
            Response::HTTP_UNPROCESSABLE_ENTITY,
        ];
    }
}
