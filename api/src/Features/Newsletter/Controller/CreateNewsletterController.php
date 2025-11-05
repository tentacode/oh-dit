<?php

declare(strict_types=1);

namespace App\Features\Newsletter\Controller;

use App\Features\Newsletter\Command\AddToBrevoCommand;
use App\Features\Newsletter\Command\BrevoNewsletter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

final class CreateNewsletterController extends AbstractController
{
    public function __construct(
        private readonly AddToBrevoCommand $addToBrevoCommand,
    ) {
    }

    #[Route('/api/newsletters', name: 'create_newsletter', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload]
        BrevoNewsletter $brevoNewsletter,
    ): JsonResponse {
        ($this->addToBrevoCommand)($brevoNewsletter);

        return $this->json([], JsonResponse::HTTP_CREATED);
    }
}
