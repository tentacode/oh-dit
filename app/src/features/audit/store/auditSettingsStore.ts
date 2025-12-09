import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectSettings {
  projectUuid: string | null;
  currentScreenUuid: string | null;
}

interface AuditSettings {
  projectsSettings: ProjectSettings[];
  collapsedRuleCategories: Record<string, boolean>; // uuid -> isCollapsed
}

interface AuditSettingsStore extends AuditSettings {
  toggleRuleCategoryCollapse: (ruleCategoryUuid: string) => void;
  isRuleCategoryCollapsed: (ruleCategoryUuid: string) => boolean;
  setProjectSetting: (settings: ProjectSettings) => void;
  getProjectSetting: (projectUuid: string) => ProjectSettings;
  reset: () => void;
}

const initialState: AuditSettings = {
  projectsSettings: [],
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
