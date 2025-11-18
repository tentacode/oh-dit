import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuditSettings {
  collapsedRuleCategories: Record<string, boolean>; // uuid -> isCollapsed
}

interface AuditSettingsStore extends AuditSettings {
  toggleRuleCategoryCollapse: (ruleCategoryUuid: string) => void;
  isRuleCategoryCollapsed: (ruleCategoryUuid: string) => boolean;
  reset: () => void;
}

const initialState: AuditSettings = {
  collapsedRuleCategories: {},
};

export const useAuditSettingsStore = create<AuditSettingsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // actions
      toggleRuleCategoryCollapse: (ruleCategoryUuid) => {
        set((state) => ({
          collapsedRuleCategories: {
            ...state.collapsedRuleCategories,
            [ruleCategoryUuid]: !state.collapsedRuleCategories[ruleCategoryUuid],
          },
        }));
      },

      reset: () => set(initialState),

      // selectors
      isRuleCategoryCollapsed: (ruleCategoryUuid) => {
        return get().collapsedRuleCategories[ruleCategoryUuid] ?? false; // Par défaut: non-collapsed
      },
    }),
    {
      name: "ohdit-audit-settings",
    }
  )
);
