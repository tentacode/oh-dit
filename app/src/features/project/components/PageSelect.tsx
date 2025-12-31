import { useAuditStore } from "../../audit/store/auditStore";

import selectStyles from "../../../components/form/styles/select.module.css";
import styles from "../styles/page_select.module.css";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { getProjectUrl } from "@/src/app/projet/routing";
import { useAuditSettingsStore } from "../../audit/store/auditSettingsStore";

export default function PageSelect({ screenUuid }: { screenUuid: string }) {
  const router = useRouter();

  const project = useAuditStore((state) => state.project);
  const setProjectSetting = useAuditSettingsStore(
    (state) => state.setProjectSetting
  );

  if (!project) {
    return null;
  }

  const currentScreen = project.screens.find(
    (screen) => screen.uuid === screenUuid
  );
  if (!currentScreen) {
    throw new Error("Current screen not found");
  }

  const setScreenUuid = (newValue: string) => {
    setProjectSetting({
      projectUuid: project.uuid,
      currentScreenUuid: newValue,
    });

    router.replace(getProjectUrl.auditScreen(project.uuid, newValue));
  };

  return (
    <Listbox value={screenUuid} onChange={setScreenUuid}>
      <div className={selectStyles.selectContainer} style={{ marginBottom: 15 }}>
        <Label aria-hidden="true" className="block">
          Page en cours :
        </Label>
        <div>
          <ListboxButton
            aria-label="Page en cours"
            className={`${selectStyles.selectBox} grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6`}
          >
            <span className="col-start-1 row-start-1 truncate pr-6">
              {currentScreen.name}
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className={`${selectStyles.selectOptions} absolute z-10 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm`}
          >
            {project.screens.map((screen) => (
              <ListboxOption
                key={screen.uuid}
                value={screen.uuid}
                className={`${selectStyles.selectOption} group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden`}
              >
                <div className={styles.pageSelectOption}>
                  <span>{screen.name}</span>
                  {screen.progress < 100 && (
                    <span className={styles.optionDetail}>
                      <ClockIcon />
                      Progrès : {screen.progress} %
                    </span>
                  )}
                  {screen.progress === 100 && (
                    <span className={styles.optionDetail}>
                      <CheckIcon />
                      Progrès : terminé
                    </span>
                  )}
                </div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </div>
    </Listbox>
  );
}
