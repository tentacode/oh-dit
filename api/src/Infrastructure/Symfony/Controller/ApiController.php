<?php

declare(strict_types=1);

namespace App\Infrastructure\Symfony\Controller;

use App\Infrastructure\Doctrine\Entity\HasUuidInterface;
use App\Infrastructure\Doctrine\Entity\SerializableInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Exception\CircularReferenceException;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Service\Attribute\Required;

class ApiController extends AbstractController
{
    protected SerializerInterface $serializer;

    #[Required]
    public function setSerializer(SerializerInterface $serializer): void
    {
        $this->serializer = $serializer;
    }

    /**
     * @param SerializableInterface|array<SerializableInterface> $item
     */
    protected function getSerializedJsonResponse(
        SerializableInterface|array $item,
        int $statusCode = JsonResponse::HTTP_OK
    ): JsonResponse {
        if ($item instanceof SerializableInterface) {
            $attributes = $item->getDefaultFields();
        } elseif ($item !== []) {
            $firstItem = $item[0];
            $attributes = $firstItem->getDefaultFields();
        } else {
            return new JsonResponse([], $statusCode, [], true);
        }

        $context = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function (object $object, ?string $_format, array $_context): string {
                if ($object instanceof HasUuidInterface) {
                    return '@' . $object->getUuid();
                }

                throw new CircularReferenceException('Cannot serialize object without UUID');
            },
            'attributes' => $attributes,
        ];

        $json = $this->serializer->serialize($item, 'json', $context);

        return new JsonResponse($json, $statusCode, [], true);
    }
}
