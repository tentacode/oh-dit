<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Query\GetProjectQuery;
use App\Infrastructure\Doctrine\Entity\HasUuidInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\Exception\CircularReferenceException;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

final class GetProjectController extends AbstractController
{
    public function __construct(
        private GetProjectQuery $getProjectQuery,
        private SerializerInterface $serializer,
    ) {
    }

    #[Route('/api/projects/{uuid}', name: 'get_project', methods: ['GET'], format: 'json')]
    public function __invoke(#[CurrentUser] User $user, string $uuid): JsonResponse
    {
        $project = ($this->getProjectQuery)($user, $uuid);
        $context = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function (object $object, ?string $_format, array $_context): string {
                if ($object instanceof HasUuidInterface) {
                    return '@' . $object->getUuid();
                }

                throw new CircularReferenceException('Cannot serialize object without UUID');
            },
        ];

        $json = $this->serializer->serialize($project, 'json', $context);

        return new JsonResponse($json, JsonResponse::HTTP_OK, [], true);
    }
}
