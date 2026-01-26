<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Query;

use function Sentry\captureMessage;
use App\Features\Issue\Entity\Issue;
use App\Features\Project\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class GetReportQuery
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(string $securedLinkToken): GetReportAnswer
    {
        $project = $this->entityManager->getRepository(Project::class)->findOneBy([
            'securedLinkToken' => $securedLinkToken,
        ]);

        if ($project === null) {
            captureMessage('Trying to access secured link report with token that did not match any project');

            throw new NotFoundHttpException('Resource not found');
        }

        $issues = $this->entityManager->getRepository(Issue::class)
            ->findBy([
                'project' => $project,
            ]);

        return new GetReportAnswer($project, $issues);
    }
}
