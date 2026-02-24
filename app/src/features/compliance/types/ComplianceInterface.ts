export type ComplianceStatus = 'none' | 'compliant' | 'non_compliant' | 'not_applicable';

export interface ComplianceInterface {
    uuid: string;
    status: ComplianceStatus;
    createdAt: string;
    ruleUuid: string;
    projectUuid: string;
    screenUuid: string;
    userUuid: string;
}