<?php

declare(strict_types=1);

namespace App\Features\RuleSet\Controller;

use App\Features\RuleSet\Query\GetRuleSetsQuery;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Cache\CacheInterface;
use Webmozart\Assert\Assert;

final class GetRuleSetsController extends ApiController
{
    public function __construct(
        private GetRuleSetsQuery $getRuleSetsQuery,
        private CacheInterface $cache,
    ) {
    }

    #[Route('/api/rule_sets', name: 'get_rule_sets', methods: ['GET'], format: 'json')]
    public function __invoke(): JsonResponse
    {
        $json = $this->cache->get('rule_sets_json', function (): string {
            $ruleSets = ($this->getRuleSetsQuery)();

            $content = $this->getSerializedJsonResponse(
                $ruleSets,
            )->getContent();

            Assert::string($content);

            return $content;
        });

        return new JsonResponse($json, JsonResponse::HTTP_OK, [], true);
    }
}
