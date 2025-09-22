<?php

declare(strict_types=1);

namespace App\Features\Authentication\tests\Controller;

use function Safe\json_decode;
use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Carbon\Carbon;
use Iterator;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Webmozart\Assert\Assert;

final class LoginCheckControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_can_login(): void
    {
        $response = $this->request(
            uri: '/api/login_check',
            method: Request::METHOD_POST,
            payload: [
                'email' => 'darth.vader@empire.com',
                'password' => 'darth_vader_64',
            ],
        );

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        Assert::stringNotEmpty($response->getContent());

        $data = json_decode($response->getContent(), true);
        Assert::isArray($data);
        $this->assertArrayHasKey('token', $data, 'The response should contain a token');

        $token = $data['token'];
        Assert::stringNotEmpty($token, 'The token should be a non-empty string');

        /** @var JWTTokenManagerInterface $jwtManager */
        $jwtManager = self::getContainer()->get(JWTTokenManagerInterface::class);

        $payload = $jwtManager->parse($token);

        $this->assertNotEmpty($payload);
        $this->assertArrayHasKey('email', $payload);
        $this->assertEquals('darth.vader@empire.com', $payload['email']);
        $this->assertArrayHasKey('exp', $payload);
        $this->assertGreaterThan(Carbon::now()->getTimestamp(), $payload['exp']);
    }

    /**
     * @param array<mixed> $payload
     * @param array<mixed> $expectedResponse
     */
    #[DataProvider('invalidLoginProvider')]
    public function test_it_cant_login_with_invalid_credentials(
        array $payload,
        array $expectedResponse,
        int $expectedStatusCode,
    ): void {
        $response = $this->request(
            uri: '/api/login_check',
            method: Request::METHOD_POST,
            payload: $payload,
        );

        $this->assertJsonResponseEquals($expectedResponse, $response, $expectedStatusCode);
    }

    public static function invalidLoginProvider(): Iterator
    {
        yield 'wrong password' => [
            [
                'email' => 'darth.vader@empire.com',
                'password' => 'wrong_password',
            ],
            [
                'code' => 401,
                'message' => 'Invalid credentials.',
            ],
            Response::HTTP_UNAUTHORIZED,
        ];

        yield 'wrong email' => [
            [
                'email' => 'darth.vader@empire.de',
                'password' => 'darth_vader_64',
            ],
            [
                'code' => 401,
                'message' => 'Invalid credentials.',
            ],
            Response::HTTP_UNAUTHORIZED,
        ];

        yield 'invalid payload' => [
            [
                'username' => 'darth.vader@empire.com',
                'password' => 'darth_vader_64',
            ],
            [
                'code' => 400,
                'message' => 'The key "email" must be provided.',
            ],
            Response::HTTP_BAD_REQUEST,
        ];
    }
}
