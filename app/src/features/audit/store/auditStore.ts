import { create } from "zustand";

export interface Screen {
  uuid: string;
  name: string;
}

export interface Project {
  uuid: string;
  name: string;
  screens: Screen[];
  ruleSet: {
    uuid: string;
  };
}

export interface Compliance {
  ruleUuid: string;
  projectUuid: string;
  screenUuid?: string;
  status: "compliant" | "non_compliant" | "not_applicable";
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

export interface ActiveElement {
  ruleUuid?: string;
  ruleCategoryUuid?: string;
  screenUuid: string;
}

interface AuditStore {
  // state
  project: Project | null;
  compliances: Compliance[];
  currentScreenUuid: string | undefined;
  ruleSet: RuleSet | null;
  activeElement: ActiveElement | null;

  // actions
  setProject: (project: Project | null) => void;
  setRuleSet: (ruleSet: RuleSet | null) => void;
  setCompliances: (compliances: Compliance[]) => void;
  overrideCompliance: (compliance: Compliance) => void;
  setCurrentScreenUuid: (uuid: string | undefined) => void;
  setActiveElement: (activeElement: ActiveElement | null) => void;
  reset: () => void;

  // selectors
  getCompliance: (
    ruleUuid: string,
    projectUuid: string,
    screenUuid?: string
  ) => Compliance | undefined;
}

const initialState = {
  project: null,
  ruleSet: null,
  compliances: [],
  currentScreenUuid: undefined,
  activeElement: null,
};

export const useAuditStore = create<AuditStore>((set, get) => ({
  ...initialState,

  // actions
  setProject: (project) => set({ project }),
  setRuleSet: (ruleSet) => set({ ruleSet }),
  setCompliances: (compliances) => set({ compliances }),
  setCurrentScreenUuid: (uuid) => set({ currentScreenUuid: uuid }),
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
  getCompliance: (ruleUuid, projectUuid, screenUuid) => {
    const { compliances } = get();
    return compliances.find(
      (c) =>
        c.ruleUuid === ruleUuid &&
        c.projectUuid === projectUuid &&
        c.screenUuid === screenUuid
    );
  },
}));
