<?php

declare(strict_types=1);

namespace App\Features\Documentation\Controller;

use App\Features\Documentation\Query\GetWhichDocumentationCommandQuery;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class RuleDocumentationController extends ApiController
{
    public function __construct(
        private GetWhichDocumentationCommandQuery $getWhichDocumentationCommandQuery,
    ) {
    }

    #[Route('/api/documentation/rule/{ruleUuid}', name: 'get_rule_documentation', methods: ['GET'], format: 'json')]
    public function __invoke(string $ruleUuid): JsonResponse
    {
        // $json = $this->cache->get(
        //     sprintf('rule_documentation_%s_json', $ruleUuid),
        //     function (ItemInterface $item) use ($ruleUuid): array {
        //         $item->tag('rule_documentation');

        //         $getDocumentationCommand = ($this->getWhichDocumentationCommandQuery)($ruleUuid);

        //         return [
        //             'ruleUuid' => $ruleUuid,
        //             'content' => ($getDocumentationCommand)($ruleUuid),
        //         ];
        //     }
        // );

        $getDocumentationCommand = ($this->getWhichDocumentationCommandQuery)($ruleUuid);

        $json = [
            'ruleUuid' => $ruleUuid,
            'content' => ($getDocumentationCommand)($ruleUuid),
        ];

        return new JsonResponse($json, JsonResponse::HTTP_OK, []);
    }
}
