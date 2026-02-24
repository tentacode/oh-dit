import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectSettings {
  projectUuid: string | null;
  currentScreenUuid: string | null;
}

export interface CollapsedRuleCategory {
  projectUuid: string;
  screenUuid: string;
  categoryUuid: string;
}

interface AuditSettings {
  projectsSettings: ProjectSettings[];
  collapsedRuleCategories: CollapsedRuleCategory[];
}

interface AuditSettingsStore extends AuditSettings {
  toggleRuleCategoryCollapse: (projectUuid: string, screenUuid: string, ruleCategoryUuid: string) => void;
  setProjectSetting: (settings: ProjectSettings) => void;
  getProjectSetting: (projectUuid: string) => ProjectSettings;
  reset: () => void;
}

const initialState: AuditSettings = {
  projectsSettings: [],
  collapsedRuleCategories: [],
};

export const useAuditSettingsStore = create<AuditSettingsStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // actions
      toggleRuleCategoryCollapse: (projectUuid, screenUuid, ruleCategoryUuid) => {
        set((state) => {
          const isCurrentlyCollapsed = state.collapsedRuleCategories.some(
            (c) =>
              c.projectUuid === projectUuid &&
              c.screenUuid === screenUuid &&
              c.categoryUuid === ruleCategoryUuid
          );

          let updatedCollapsedCategories: CollapsedRuleCategory[];
          if (isCurrentlyCollapsed) {
            updatedCollapsedCategories = state.collapsedRuleCategories.filter(
              (c) =>
                !(
                  c.projectUuid === projectUuid &&
                  c.screenUuid === screenUuid &&
                  c.categoryUuid === ruleCategoryUuid
                )
            );
          } else {
            updatedCollapsedCategories = [
              ...state.collapsedRuleCategories,
              { projectUuid, screenUuid, categoryUuid: ruleCategoryUuid },
            ];
          }

          return {
            collapsedRuleCategories: updatedCollapsedCategories,
          };
        });
      },

      setProjectSetting: (settings) => {
        set((state) => {
          const existingIndex = state.projectsSettings.findIndex(
            (s) => s.projectUuid === settings.projectUuid
          );

          const updatedProjectsSettings = [...state.projectsSettings];

          if (existingIndex !== -1) {
            updatedProjectsSettings[existingIndex] = settings;
          } else {
            updatedProjectsSettings.push(settings);
          }

          return {
            projectsSettings: updatedProjectsSettings,
          };
        });
      },

      getProjectSetting: (projectUuid) => {
        const setting = get().projectsSettings.find(
          (s) => s.projectUuid === projectUuid
        );
        if (setting) {
          return setting;
        }
        return { projectUuid: projectUuid, currentScreenUuid: null };
      },

      reset: () => set(initialState)
    }),
    {
      name: "ohdit-audit-settings",
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as AuditSettings;

        if (version === 0) {
          state.collapsedRuleCategories = [];
        }
        
        return state;
      },
    }
  )
);
