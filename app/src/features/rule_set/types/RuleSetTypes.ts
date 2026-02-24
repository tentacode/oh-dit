export interface RuleSet {
    uuid: string;
    name: string;
    version: string;
    description: string;
    ruleCategories: RuleCategory[];
}

export interface RuleCategory {
    uuid: string;
    name: string;
    prefix: string;
    rules: Rule[];
    ruleSet: RuleSet;
}

export interface Rule {
    uuid: string;
    prefix: string;
    shortDescription: string;
    ruleCategory: RuleCategory;
    complianceStatus: ComplianceStatus;
}

export type ComplianceStatus = 'none' | 'compliant' | 'non_compliant' | 'not_applicable';