import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IssueFormState {
  context: "project_issues" | "rule_issues";
  issueUuid: string | null;
  ruleUuid: string;
  screenUuid: string;
  issueId: number | null;
  mode: "duplicate" | "edit" | "delete" | "create";
  severity: "low" | "moderate" | "blocking";
  text: string;
  status: 'pending' | 'fixed';
}

interface IssuesFormState {
  issuesFormState: IssueFormState[];
}

interface IssuesFormStateStore extends IssuesFormState {
  reset: () => void;
  overrideIssueFormState: (newState: IssueFormState) => void;
  removeIssueFormState: (ruleUuid: string, screenUuid: string, context: "project_issues" | "rule_issues") => void;
}

const initialState: IssuesFormState = {
  issuesFormState: [],
};

export const useIssuesFormStateStore = create<IssuesFormStateStore>()(
  persist(
    (set) => ({
      ...initialState,

      // actions
      reset: () => set(initialState),
      overrideIssueFormState: (newIssueFormState) => {
        set((state) => {
          const existingIndex = state.issuesFormState.findIndex(
            (s) =>
              s.ruleUuid === newIssueFormState.ruleUuid &&
              s.screenUuid === newIssueFormState.screenUuid &&
              s.context === newIssueFormState.context
          );

          if (existingIndex !== -1) {
            const updatedStates = [...state.issuesFormState];
            updatedStates[existingIndex] = newIssueFormState;
            return { issuesFormState: updatedStates };
          } else {
            return { issuesFormState: [...state.issuesFormState, newIssueFormState] };
          }
        });
      },
      removeIssueFormState: (ruleUuid, screenUuid, context) => {
        set((state) => ({
          issuesFormState: state.issuesFormState.filter(
            (s) => !(s.ruleUuid === ruleUuid && s.screenUuid === screenUuid && s.context === context)
          ),
        }));
      },

      // selectors
    }),
    {
      name: "ohdit-issues-state-store",
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as IssuesFormState;

        if (version === 0) {
          state.issuesFormState = state.issuesFormState.map(
            (issue: IssueFormState) => ({
              ...issue,
              context: "rule_issues",
            })
          );
        }
        
        return state;
      },
    }
  )
);
