import { useAuditStore } from "../../audit/store/auditStore";

import styles from "../../../components/form/styles/select.module.css";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import CheckIcon from "@heroicons/react/24/solid/esm/CheckIcon";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

export default function PageSelect() {
  const currentScreenUuid = useAuditStore((state) => state.currentScreenUuid);
  const setCurrentScreenUuid = useAuditStore(
    (state) => state.setCurrentScreenUuid
  );
  const project = useAuditStore((state) => state.project);

  if (!project) {
    return null;
  }

  const currentScreen = project.screens.find((screen => screen.uuid === currentScreenUuid));
  if (!currentScreen) {
    throw new Error("Current screen not found");
  }

  return (
    <Listbox value={currentScreenUuid} onChange={setCurrentScreenUuid}>
      <div className={styles.selectContainer}>
        <Label aria-hidden="true" className="block">Page en cours :</Label>
        <div>
          <ListboxButton aria-label="Page en cours" className={`${styles.selectBox} grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6`}>
            <span className="col-start-1 row-start-1 truncate pr-6">{currentScreen.name}</span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className={`${styles.selectOptions} absolute z-10 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm`}
          >
            {project.screens.map((screen) => (
              <ListboxOption
                key={screen.uuid}
                value={screen.uuid}
                className={`${styles.selectOption} group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden`}
              >
                <span className="block truncate group-data-selected:font-semibold">{screen.name}</span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </div>
    </Listbox>
  );
}
