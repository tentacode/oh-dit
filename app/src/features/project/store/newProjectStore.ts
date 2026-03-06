import { create } from "zustand";

interface NewProjectScreen {
  name: string;
  url?: string;
}

interface NewProjectStore {
  // state
  name?: string;
  url?: string;
  screens: NewProjectScreen[];
  ruleSetUuid?: string;

  // actions
  setName: (name: string) => void;
  setUrl: (url: string) => void;
  setScreens: (screens: NewProjectScreen[]) => void;
  addScreen: (screen: NewProjectScreen) => void;
  updateScreen: (index: number, screen: NewProjectScreen) => void;
  moveScreen: (fromIndex: number, toIndex: number) => void;
  removeScreen: (index: number) => void;
  setRuleSetUuid: (ruleSetUuid: string) => void;
  reset: () => void;
}

const initialState = {
  name: undefined,
  url: undefined,
  screens: [],
  ruleSetUuid: undefined,
};

export const useNewProjectStore = create<NewProjectStore>((set) => ({
  ...initialState,

  // actions
  setName: (name) => set({ name }),
  setUrl: (url) => set({ url }),
  setScreens: (screens) => set({ screens }),
  addScreen: (screen) =>
    set((state) => ({ screens: [...state.screens, screen] })),
  updateScreen: (index, screen) =>
    set((state) => {
      const newScreens = [...state.screens];
      newScreens[index] = screen;
      return { screens: newScreens };
    }),
  moveScreen: (fromIndex, toIndex) =>
    set((state) => {
      const newScreens = [...state.screens];
      const [movedScreen] = newScreens.splice(fromIndex, 1);
      newScreens.splice(toIndex, 0, movedScreen);
      return { screens: newScreens };
    }),
  removeScreen: (index) =>
    set((state) => {
      const newScreens = [...state.screens];
      newScreens.splice(index, 1);
      return { screens: newScreens };
    }),
  setRuleSetUuid: (ruleSetUuid) => set({ ruleSetUuid }),
  reset: () => set(initialState),

  // selectors (leave emtpy, error prone)
}));
