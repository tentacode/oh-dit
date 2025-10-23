<?php

declare(strict_types=1);

namespace App\Features\RuleSet\tests\Controller;

use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class GetRuleSetsControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    public function test_it_get_all_rule_sets(): void
    {
        $response = $this->request(
            uri: '/api/rule_sets/',
            method: Request::METHOD_GET,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseMatches([
            [
                'uuid' => '@uuid@',
                'name' => 'IWSQA',
                'description' => 'Imperial Weapon Systems Quality Assurance Standard',
                'version' => '1.3.3.7',
                'createdAt' => '@datetime@',
                'updatedAt' => '@datetime@',
                'ruleCategories' => [
                    [
                        'uuid' => '@uuid@',
                        'prefix' => '1',
                        'name' => 'Personnel & Training',
                        'createdAt' => '@datetime@',
                        'updatedAt' => '@datetime@',
                        'ruleSet' => '@@uuid@',
                        'rules' => [
                            [
                                'uuid' => '@uuid@',
                                'prefix' => '1.1',
                                'shortDescription' => 'Les Stormtroopers doivent atteindre un taux de réussite minimal aux tests de tir.',
                                'createdAt' => '@datetime@',
                                'updatedAt' => '@datetime@',
                                'ruleCategory' => '@@uuid@',
                            ],
                            '@...@',
                        ],
                    ],
                    '@...@',
                ],
            ]
        ], $response, Response::HTTP_OK);
    }

    public function test_it_cant_get_all_rule_sets_if_not_logged_in(): void
    {
        $response = $this->request(
            uri: '/api/rule_sets/',
            method: Request::METHOD_GET,
        );

        $this->assertJsonResponseMatches([
            'code' => 401,
            'message' => 'JWT Token not found',
        ], $response, Response::HTTP_UNAUTHORIZED);
    }
}
