export type Severity = 'low' | 'moderate' | 'blocking';

export interface IssueInterface {
    uuid: string;
    issueId: number;
    severity: Severity;
    status: 'pending' | 'fixed';
    text: string;
    createdAt: string;
    updatedAt: string;
    ruleUuid: string;
    projectUuid: string;
    screenUuid: string;
    userUuid: string;
}