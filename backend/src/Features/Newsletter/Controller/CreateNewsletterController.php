<?php

declare(strict_types=1);

namespace App\Features\Newsletter\Controller;

use App\Features\Newsletter\Entity\Newsletter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

final class CreateNewsletterController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/api/newsletters', name: 'create_newsletter', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload]
        Newsletter $newsletter,
    ): JsonResponse {
        $this->entityManager->persist($newsletter);
        $this->entityManager->flush();

        return $this->json($newsletter, JsonResponse::HTTP_CREATED);
    }
}
