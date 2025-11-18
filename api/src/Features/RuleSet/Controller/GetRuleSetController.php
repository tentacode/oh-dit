<?php

declare(strict_types=1);

namespace App\Features\RuleSet\Controller;

use App\Features\RuleSet\Entity\RuleSet;
use App\Features\RuleSet\Query\GetRuleSetQuery;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Cache\CacheInterface;
use Webmozart\Assert\Assert;

final class GetRuleSetController extends ApiController
{
    public function __construct(
        private GetRuleSetQuery $getRuleSetQuery,
        private CacheInterface $cache,
    ) {
    }

    #[Route('/api/rule_sets/{uuid}', name: 'get_rule_set', methods: ['GET'], format: 'json')]
    public function __invoke(string $uuid): JsonResponse
    {
        $json = $this->cache->get(
            sprintf('rule_set_%s_json', $uuid),
            function () use ($uuid): string {
                $ruleSet = ($this->getRuleSetQuery)($uuid);
                if (! $ruleSet instanceof RuleSet) {
                    throw $this->createNotFoundException('Rule set not found.');
                }

                $content = $this->getSerializedJsonResponse(
                    $ruleSet,
                )->getContent();

                Assert::string($content);

                return $content;
            }
        );

        return new JsonResponse($json, JsonResponse::HTTP_OK, [], true);
    }
}
