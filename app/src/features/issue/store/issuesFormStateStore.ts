import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IssueFormState {
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
  removeIssueFormState: (ruleUuid: string, screenUuid: string) => void;
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
      overrideIssueFormState: (newState) => {
        set((state) => {
          const existingIndex = state.issuesFormState.findIndex(
            (s) =>
              s.ruleUuid === newState.ruleUuid &&
              s.screenUuid === newState.screenUuid
          );

          if (existingIndex !== -1) {
            const updatedStates = [...state.issuesFormState];
            updatedStates[existingIndex] = newState;
            return { issuesFormState: updatedStates };
          } else {
            return { issuesFormState: [...state.issuesFormState, newState] };
          }
        });
      },
      removeIssueFormState: (ruleUuid, screenUuid) => {
        set((state) => ({
          issuesFormState: state.issuesFormState.filter(
            (s) => !(s.ruleUuid === ruleUuid && s.screenUuid === screenUuid)
          ),
        }));
      },

      // selectors
    }),
    {
      name: "ohdit-issues-state-store",
    }
  )
);
