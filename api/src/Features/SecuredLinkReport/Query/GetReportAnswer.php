<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Query;

use App\Features\Issue\Entity\Issue;
use App\Features\Project\Entity\Project;
use App\Infrastructure\Doctrine\Entity\SerializableInterface;

final class GetReportAnswer implements SerializableInterface
{
    public function __construct(
        private readonly Project $project,
        /**
         * @var array<int, Issue>
         */
        private readonly array $issues,
    ) {
    }

    public function getProject(): Project
    {
        return $this->project;
    }

    /**
     * @return array<int, Issue>
     */
    public function getIssues(): array
    {
        return $this->issues;
    }

    public function getDefaultFields(): array
    {
        return [
            'project' => [
                'name',
                'url',
                'status',
                'progress',
                'complianceRate',
                'updatedAt',
                'screens' => [
                    'uuid',
                    'url',
                    'name',
                    'progress',
                    'complianceRate',
                    'rank',
                    'isRoot',
                ],
                'ruleSet' => [
                    'name',
                    'version',
                    'description',
                    'ruleCategories' => [
                        'prefix',
                        'name',
                        'rules' => [
                            'uuid',
                            'prefix',
                            'shortDescription',
                        ],
                    ],
                ],
            ],
            'issues' => [
                'uuid',
                'issueId',
                'severity',
                'status',
                'text',
                'createdAt',
                'updatedAt',
                'ruleUuid',
                'screenUuid',
            ],
        ];
    }
}
