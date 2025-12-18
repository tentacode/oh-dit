<?php

declare(strict_types=1);

namespace App\Features\Documentation\Controller;

use App\Features\Documentation\Command\GetRuleDocumentationMarkdown;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

class RuleDocumentationController extends ApiController
{
    public function __construct(
        private TagAwareCacheInterface $cache,
        private GetRuleDocumentationMarkdown $getRuleDocumentationMarkdown,
    ) {
    }

    #[Route('/api/documentation/rule/{ruleUuid}', name: 'get_rule_documentation', methods: ['GET'], format: 'json')]
    public function __invoke(string $ruleUuid): JsonResponse
    {
        $json = $this->cache->get(
            sprintf('rule_documentation_%s_json', $ruleUuid),
            function (ItemInterface $item) use ($ruleUuid): array {
                $item->tag('rule_documentation');

                return [
                    'ruleUuid' => $ruleUuid,
                    'content' => ($this->getRuleDocumentationMarkdown)($ruleUuid),
                ];
            }
        );

        return new JsonResponse($json, JsonResponse::HTTP_OK, []);
    }
}
