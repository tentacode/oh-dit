import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TeamStore {
  uuid: string;
  name: string;
}

interface TeamsState {
  currentTeamUuid: string | undefined;
  teams: TeamStore[];
}

interface TeamsStateStore extends TeamsState {
  reset: () => void;
  setTeams: (teams: TeamStore[]) => void;
  setCurrentTeamUuid: (uuid: string) => void;
}

const initialState: TeamsState = {
  currentTeamUuid: undefined,
  teams: [],
};

export const useTeamsStateStore = create<TeamsStateStore>()(
  persist(
    (set) => ({
      ...initialState,

      // actions
      reset: () => set(initialState),
      setTeams: (teams: TeamStore[]) => set({ teams }),
      setCurrentTeamUuid: (uuid: string) => set({ currentTeamUuid: uuid }),

      // selectors
    }),
    {
      name: "ohdit-teams-state-store",
    }
  )
);
