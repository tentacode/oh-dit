<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\tests\Controller;

use function Safe\json_decode;
use App\Features\Project\Fixture\Story\ProjectsStory;
use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Webmozart\Assert\Assert;

final class LoginSecuredLinkControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    private const SECURED_LINK_PASSWORD = 'Dark Vador 111';

    private ?string $securedLinkToken = null;

    protected function setUp(): void
    {
        parent::setUp();
        $this->securedLinkToken = $this->createSecuredLink();
    }

    public function test_it_can_login_with_valid_password(): void
    {
        $response = $this->request(
            uri: '/api/secured-link/' . $this->securedLinkToken . '/login',
            method: Request::METHOD_POST,
            payload: [
                'password' => self::SECURED_LINK_PASSWORD,
            ],
        );

        $this->assertJsonResponseMatches([
            'token' => '@string@.isNotEmpty()',
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cannot_login_with_invalid_password(): void
    {
        $response = $this->request(
            uri: '/api/secured-link/' . $this->securedLinkToken . '/login',
            method: Request::METHOD_POST,
            payload: [
                'password' => 'wrong_password',
            ],
        );

        $this->assertJsonResponseMatches([
            'error' => 'Invalid credentials',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }

    public function test_it_cannot_login_with_invalid_token(): void
    {
        $response = $this->request(
            uri: '/api/secured-link/non-existent-token/login',
            method: Request::METHOD_POST,
            payload: [
                'password' => self::SECURED_LINK_PASSWORD,
            ],
        );

        $this->assertJsonResponseMatches([
            'error' => 'Invalid credentials',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }

    public function test_it_cannot_login_without_password(): void
    {
        $response = $this->request(
            uri: '/api/secured-link/' . $this->securedLinkToken . '/login',
            method: Request::METHOD_POST,
            payload: [],
        );

        $this->assertJsonResponseMatches([
            'code' => 'unprocessable_entity',
            'message' => 'Validation Failed',
            'errors' => [
                [
                    'code' => null,
                    'propertyPath' => 'password',
                    'message' => 'Cette valeur doit être de type string.',
                ],
            ],
        ], $response, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    private function createSecuredLink(): string
    {
        $response = $this->request(
            uri: '/api/projects/' . ProjectsStory::PROJECT_DEATH_STAR_UUID . '/secured-link',
            method: Request::METHOD_POST,
            payload: [
                'password' => self::SECURED_LINK_PASSWORD,
            ],
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            'securedLinkToken' => '@string@.isNotEmpty()',
        ], $response, Response::HTTP_OK);

        Assert::string($response->getContent());

        /** @var array<string, string> */
        $data = json_decode($response->getContent(), true);

        Assert::keyExists($data, 'securedLinkToken');

        return $data['securedLinkToken'];
    }
}
