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

final class GetSecuredLinkReportControllerTest extends WebTestCase
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

    public function test_it_can_access_report_with_valid_jwt(): void
    {
        $jwt = $this->getSecuredLinkJwt();

        $response = $this->request(
            uri: '/api/secured-link/' . $this->securedLinkToken,
            method: Request::METHOD_GET,
            authenticationToken: $jwt,
        );

        $this->assertJsonResponseMatches([
            'project' => [
                'ruleSet' => '@...@',
                'screens' => ['@...@'],
                'name' => 'Death Star',
                'url' => 'https://www.death.empire',
                'updatedAt' => '@datetime@',
                'status' => 'in progress',
                'progress' => 10,
                'complianceRate' => 62,
            ],
            'issues' => [
                '@...@',
            ],
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cannot_access_report_without_jwt(): void
    {
        $response = $this->request(
            uri: '/api/secured-link/' . $this->securedLinkToken,
            method: Request::METHOD_GET,
        );

        $this->assertJsonResponseMatches([
            'error' => '@string@.isNotEmpty()',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }

    public function test_it_cannot_access_report_with_invalid_jwt(): void
    {
        $response = $this->request(
            uri: '/api/secured-link/' . $this->securedLinkToken,
            method: Request::METHOD_GET,
            authenticationToken: 'invalid_jwt_token',
        );

        $this->assertJsonResponseMatches([
            'error' => '@string@.isNotEmpty()',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }

    public function test_it_cannot_access_different_report_with_jwt(): void
    {
        $jwt = $this->getSecuredLinkJwt();

        $response = $this->request(
            uri: '/api/projects/' . ProjectsStory::PROJECT_XWING_UUID . '/secured-link',
            method: Request::METHOD_POST,
            payload: [
                'password' => self::SECURED_LINK_PASSWORD,
            ],
            authenticationToken: $this->getAuthenticationToken(
                email: 'luke@rebels.com',
                password: 'luke69420',
            ),
        );

        $this->assertJsonResponseMatches([
            'securedLinkToken' => '@string@.isNotEmpty()',
        ], $response, Response::HTTP_OK);

        Assert::string($response->getContent());

        /** @var array<string, string> */
        $data = json_decode($response->getContent(), true);

        Assert::keyExists($data, 'securedLinkToken');

        $differentToken = $data['securedLinkToken'];

        $response = $this->request(
            uri: '/api/secured-link/' . $differentToken,
            method: Request::METHOD_GET,
            authenticationToken: $jwt,
        );

        $this->assertJsonResponseMatches([
            'code' => 'not_found',
            'message' => 'Resource not found.',
        ], $response, Response::HTTP_NOT_FOUND);
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

    private function getSecuredLinkJwt(): string
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

        Assert::string($response->getContent());

        /** @var array<string, string> */
        $data = json_decode($response->getContent(), true);
        Assert::keyExists($data, 'token');

        return $data['token'];
    }
}
