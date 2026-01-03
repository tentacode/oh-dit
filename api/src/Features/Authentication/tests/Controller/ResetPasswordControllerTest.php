<?php

declare(strict_types=1);

namespace App\Features\Authentication\tests\Controller;

use function Safe\json_decode;
use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Webmozart\Assert\Assert;

final class ResetPasswordControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_can_reset_a_password(): void
    {
        // Get the reset token
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

        $content = $response->getContent();

        Assert::notFalse($content);

        /** @var array{token: string} $data */
        $data = json_decode($content, true);
        $token = $data['token'];

        // Ask to reset the password
        $response = $this->request(
            uri: '/api/reset_password',
            method: Request::METHOD_POST,
            payload: [
                'token' => $token,
                'newPassword' => 'vader_is_the_best_64',
            ],
        );

        $this->assertJsonResponseMatches([
            'token' => '@string@',
        ], $response, Response::HTTP_OK);

        // Try to login with the new password
        $response = $this->request(
            uri: '/api/login_check',
            method: Request::METHOD_POST,
            payload: [
                'email' => 'darth_vader@empire.com',
                'password' => 'vader_is_the_best_64',
            ],
        );

        $this->assertJsonResponseMatches([
            'token' => '@string@',
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cant_reset_a_password_with_invalid_token(): void
    {
        $response = $this->request(
            uri: '/api/reset_password',
            method: Request::METHOD_POST,
            payload: [
                'token' => 'invalid_token',
                'newPassword' => 'vader_is_the_best_64',
            ],
        );

        $this->assertJsonResponseMatches([
            'code' => 'not_found',
            'message' => 'Resource not found.',
        ], $response, Response::HTTP_NOT_FOUND);
    }

    public function test_it_cant_reset_a_password_with_an_expired_token(): void
    {
        // Get the reset token
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

        $content = $response->getContent();
        Assert::notFalse($content);

        /** @var array{token: string} $data */
        $data = json_decode($content, true);
        $token = $data['token'];

        $entityManager = self::getContainer()->get(EntityManagerInterface::class);
        Assert::isInstanceOf($entityManager, EntityManagerInterface::class);

        $entityManager->getConnection()->executeStatement(
            'UPDATE "user" SET password_reset_expire_at = NOW() - INTERVAL \'2 hours\' WHERE password_reset_token = ?',
            [$token],
        );

        $response = $this->request(
            uri: '/api/reset_password',
            method: Request::METHOD_POST,
            payload: [
                'token' => $token,
                'newPassword' => 'vader_is_the_best_64',
            ],
        );

        $this->assertJsonResponseMatches([
            'code' => 'bad_request',
            'message' => 'Le token de réinitialisation a expiré.',
        ], $response, Response::HTTP_BAD_REQUEST);
    }
}
