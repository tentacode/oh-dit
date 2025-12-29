import { create } from "zustand";

export interface Screen {
  uuid: string;
  name: string;
  url?: string;
  progress: number;
  complianceRate: number;
}

export interface Project {
  uuid: string;
  name: string;
  url?: string;
  screens: Screen[];
  progress: number;
  complianceRate: number;
  ruleSet: {
    uuid: string;
  };
}

export interface Compliance {
  ruleUuid: string;
  projectUuid: string;
  screenUuid: string;
  status: "compliant" | "non_compliant" | "not_applicable";
}

export interface Issue {
  uuid: string;
  issueId: number;
  severity: "low" | "moderate" | "blocking";
  text: string;
  ruleUuid: string;
  projectUuid: string;
  screenUuid: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rule {
  uuid: string;
  prefix: string;
  shortDescription: string;
}

export interface RuleCategory {
  uuid: string;
  prefix: string;
  name: string;
  rules: Rule[];
}

export interface RuleSet {
  uuid: string;
  name: string;
  description: string;
  version: string;
  ruleCategories: RuleCategory[];
}

export enum ActiveButton {
  COMPLIANT = "compliant",
  NON_COMPLIANT = "non_compliant",
  NOT_APPLICABLE = "not_applicable",
  ISSUES = "issues",
  COMMENTS = "comments",
  HELP = "help",
}

export interface ActiveElement {
  ruleUuid?: string;
  ruleCategoryUuid?: string;
  screenUuid: string;
  buttonFocused?: ActiveButton;
}

interface AuditStore {
  // state
  project: Project | null;
  compliances: Compliance[];
  issues: Issue[];
  ruleSet: RuleSet | null;
  activeElement: ActiveElement | null;

  // actions
  setProject: (project: Project | null) => void;
  setRuleSet: (ruleSet: RuleSet | null) => void;
  setCompliances: (compliances: Compliance[]) => void;
  setIssues: (issues: Issue[]) => void;
  overrideCompliance: (compliance: Compliance) => void;
  addIssue: (issue: Issue) => void;
  overrideIssue: (issue: Issue) => void;
  removeIssue: (issueUuid: string) => void;
  setActiveElement: (activeElement: ActiveElement | null) => void;
  reset: () => void;
}

const initialState = {
  project: null,
  ruleSet: null,
  compliances: [],
  issues: [],
  activeElement: null,
};

export const useAuditStore = create<AuditStore>((set, get) => ({
  ...initialState,

  // actions
  setProject: (project) => set({ project }),
  setRuleSet: (ruleSet) => set({ ruleSet }),
  setCompliances: (compliances) => set({ compliances }),
  setIssues: (issues) => set({ issues }),
  addIssue: (issue) => {
    console.log("Adding issue:", issue);
    set((state) => {
      const newIssues = [...state.issues, issue];
      console.log("New issues array:", newIssues);
      return { issues: newIssues };
    });
  },
  overrideIssue: (issue) => {
    set((state) => {
      const existingIndex = state.issues.findIndex(
        (i) => i.uuid === issue.uuid
      );

      if (existingIndex >= 0) {
        const newIssues = [...state.issues];
        newIssues[existingIndex] = issue;
        return { issues: newIssues };
      } else {
        return { issues: [...state.issues, issue] };
      }
    });
  },
  removeIssue: (issueUuid) => {
    set((state) => ({
      issues: state.issues.filter((i) => i.uuid !== issueUuid),
    }));
  },
  setActiveElement: (activeElement) => set({ activeElement }),
  overrideCompliance: (compliance) => {
    const { compliances } = get();

    const existingIndex = compliances.findIndex(
      (c) =>
        c.ruleUuid === compliance.ruleUuid &&
        c.projectUuid === compliance.projectUuid &&
        c.screenUuid === compliance.screenUuid
    );

    if (existingIndex >= 0) {
      const newCompliances = [...compliances];
      newCompliances[existingIndex] = compliance;
      set({ compliances: newCompliances });
    } else {
      set({ compliances: [...compliances, compliance] });
    }
  },
  reset: () => set(initialState),

  // selectors
}));
