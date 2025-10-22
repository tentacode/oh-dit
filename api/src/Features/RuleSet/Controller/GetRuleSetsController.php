<?php

declare(strict_types=1);

namespace App\Features\RuleSet\Controller;

use App\Features\RuleSet\Query\GetRuleSetsQuery;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

final class GetRuleSetsController extends AbstractController
{
    public function __construct(
        private GetRuleSetsQuery $getRuleSetsQuery,
        private CacheInterface $cache,
        private SerializerInterface $serializer,
    ) {
    }

    #[Route('/api/rule_sets', name: 'get_rule_sets', methods: ['GET'], format: 'json')]
    public function __invoke(): JsonResponse {
        $json = $this->cache->get('rule_sets_json',  function (): string {
            $ruleSets = ($this->getRuleSetsQuery)();

            $context = [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function (object $object, ?string $format, array $context) {
                    return "@{$object->getUuid()}";
                },
            ];

            return $this->serializer->serialize($ruleSets, 'json', $context);
        });

        return new JsonResponse($json, JsonResponse::HTTP_OK, [], true);
    }
}
