<?php

declare(strict_types=1);

namespace App\Features\Documentation\tests\Controller;

use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class RuleDocumentationControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_gets_a_rule_documentation(): void
    {
        $response = $this->request(
            uri: '/api/documentation/rule/12341234-2222-4000-8001-000000000001',
            method: Request::METHOD_GET,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseLength(2, $response);

        $this->assertJsonResponseMatches([
            'ruleUuid' => '12341234-2222-4000-8001-000000000001',
            'content' => '@string@',
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cant_get_a_rule_documentation_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: '/api/documentation/rule/12341234-2222-4000-8001-000000000001',
            method: Request::METHOD_GET,
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }
}
