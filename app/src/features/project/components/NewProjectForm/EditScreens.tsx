import styles from "../../../../components/form/styles/form.module.css";
import formStyles from "@/src/design-system/styles/form/form.module.css";
import buttonStyles from "@/src/design-system/styles/button/button.module.css";

import {
  DocumentPlusIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { CreateScreenPayload } from "../../mutations/useCreateProject";
import { useRef, useState } from "react";
import Button from "@/src/design-system/components/button/Button";
import AddScreenModal from "./AddScreenModal";
import EditScreenModal from "./EditScreenModal";
import { useTranslations } from "next-intl";
import DefaultPageSampleInstructions from "./EditScreens/DefaultPageSampleInstructions";
import PageSampleInstructions from "./EditScreens/PageSampleInstructions";

export default function EditScreens({
  context,
  values,
  onChange,
  ruleSetName,
  showFieldSetTitle = true,
  onDelete,
}: {
  context: "new_project" | "project_exists";
  values: CreateScreenPayload[];
  onChange: (newValues: CreateScreenPayload[]) => void;
  ruleSetName: string;
  onDelete?: (screen: CreateScreenPayload) => void;
  showFieldSetTitle?: boolean;
}) {
  const screens = values;

  const [editPageRank, setEditPageRank] = useState<number | null>(null);
  const [addScreenModalOpen, setAddScreenModalOpen] = useState<boolean>(false);

  const t = useTranslations();

  const addButtonRef = useRef<HTMLButtonElement>(null);

  const editedScreen =
    editPageRank !== null
      ? screens.find((screen) => screen.rank === editPageRank)
      : null;

  const movePageUp = (rank: number) => {
    if (rank === 1) return;

    const newScreens = [...screens];
    const index = newScreens.findIndex((screen) => screen.rank === rank);
    const temp = newScreens[index - 1];
    newScreens[index - 1] = newScreens[index];
    newScreens[index] = temp;

    newScreens[index - 1].rank = rank - 1;
    newScreens[index].rank = rank;

    onChange(newScreens);

    document.getElementById(`move-screen-up-${rank - 1}`)?.focus();
  };

  const movePageDown = (rank: number) => {
    if (rank === screens.length) return;

    const newScreens = [...screens];
    const index = newScreens.findIndex((screen) => screen.rank === rank);
    const temp = newScreens[index + 1];
    newScreens[index + 1] = newScreens[index];
    newScreens[index] = temp;

    newScreens[index + 1].rank = rank + 1;
    newScreens[index].rank = rank;

    onChange(newScreens);

    document.getElementById(`move-screen-down-${rank + 1}`)?.focus();
  };

  const removePage = (rank: number) => {
    if (screens.length <= 1) {
      return;
    }

    const screenToDelete = screens.find((screen) => screen.rank === rank);
    if (!screenToDelete) {
      return;
    }

    if (onDelete) {
      onDelete(screenToDelete);

      return;
    };

    const newScreens = screens
      .filter((screen) => screen.rank !== rank)
      .map((screen, index) => ({
        ...screen,
        rank: index + 1,
      }));

    onChange(newScreens);
    document.getElementById(`delete-screen-${rank - 1}`)?.focus();
  };

  let ruleSetType: "web" | "mobile" | "document" = "web";

  if (ruleSetName === "RAAM") {
    ruleSetType = "mobile";
  }

  if (ruleSetName === "RAPDF") {
    ruleSetType = "document";
  }

  return (
    <>
      <fieldset>
        <legend className={formStyles.fieldsetHeadingLegend}>
          {showFieldSetTitle && (
            <>
              {t(`ruleSet.${ruleSetType}.screens`)} à auditer
              <span className={styles.requiredStar} aria-hidden="true">
                *
              </span>
              :
            </>
          )}
          <p className={styles.fieldsetInfo}>
            {context === "new_project" ? (
              <DefaultPageSampleInstructions ruleSetName={ruleSetName} />
            ) : (
              <PageSampleInstructions ruleSetName={ruleSetName} />
            )}
          </p>
        </legend>
        <ul>
          {screens.map((screen, index) => (
            <li key={index}>
              <div className={styles.inputContainer}>
                <span className={styles.fieldsetListIndex} aria-hidden="true">
                  {screen.rank}.
                </span>

                <span style={{ flex: 1, alignSelf: "flex-start" }}>
                  {screen.name}
                  <br />
                  {screen.url && (
                    <>
                      <span
                        style={{
                          color: "#555555",
                          fontStyle: "italic",
                          fontSize: "16px",
                        }}
                      >
                        {screen.url}
                      </span>
                    </>
                  )}
                </span>

                <Button
                  id={`move-screen-up-${screen.rank}`}
                  type="button"
                  className={buttonStyles.smallRoundButton}
                  ariaLabel={
                    screen.rank === 1
                      ? `Monter la page "${screen.name}" (impossible car déjà en première position).`
                      : `Monter la page "${screen.name}" en position ${
                          screen.rank - 1
                        }.`
                  }
                  onClick={() => {
                    if (screen.rank === 1) {
                      return;
                    }
                    movePageUp(screen.rank);
                  }}
                >
                  <ArrowUpIcon />
                </Button>

                <Button
                  id={`move-screen-down-${screen.rank}`}
                  type="button"
                  className={buttonStyles.smallRoundButton}
                  ariaLabel={
                    screen.rank === screens.length
                      ? `Descendre la page "${screen.name}" (impossible car déjà en dernière position).`
                      : `Descendre la page "${screen.name}" en position ${
                          screen.rank + 1
                        }.`
                  }
                  onClick={() => {
                    if (screen.rank === screens.length) {
                      return;
                    }
                    movePageDown(screen.rank);
                  }}
                >
                  <ArrowDownIcon />
                </Button>

                <Button
                  id={`edit-screen-${screen.rank}`}
                  type="button"
                  className={buttonStyles.smallRoundButton}
                  ariaLabel={`${t(`ruleSet.${ruleSetType}.editTheScreen`)} ${screen.rank} "${screen.name}"`}
                  onClick={() => setEditPageRank(screen.rank)}
                >
                  <PencilSquareIcon />
                </Button>

                <Button
                  id={`delete-screen-${screen.rank}`}
                  ariaLabel={`${t(`ruleSet.${ruleSetType}.deleteTheScreen`)} ${screen.rank} "${screen.name}"`}
                  type="button"
                  className={buttonStyles.smallRoundButton}
                  disabled={screens.length <= 1}
                  onClick={() => {
                    removePage(screen.rank);
                  }}
                >
                  <TrashIcon />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </fieldset>

      <Button
        ariaHasPopup="dialog"
        ref={addButtonRef}
        onClick={() => setAddScreenModalOpen(true)}
        style={{ marginLeft: "auto" }}
      >
        <DocumentPlusIcon />
        {t(`ruleSet.${ruleSetType}.addAScreen`)}
      </Button>

      <AddScreenModal
        ruleSetType={ruleSetType}
        open={addScreenModalOpen}
        onClose={() => {
          setAddScreenModalOpen(false);
          addButtonRef.current?.focus();
        }}
        onAdd={(newScreen: { name: string; url: string }) => {
          const newScreens = [...screens, newScreen].map((screen, index) => ({
            ...screen,
            rank: index + 1,
          }));

          onChange(newScreens);
          setAddScreenModalOpen(false);
          addButtonRef.current?.focus();
        }}
      />

      <EditScreenModal
        ruleSetType={ruleSetType}
        editedScreenName={editedScreen?.name ?? ""}
        editedScreenUrl={editedScreen?.url ?? ""}
        open={editPageRank !== null}
        onClose={() => {
          document.getElementById(`edit-screen-${editPageRank ?? ""}`)?.focus();
          setEditPageRank(null);
        }}
        onEdit={(editedScreen: { name: string; url: string }) => {
          if (editPageRank === null) return;

          const newScreens = screens.map((screen) =>
            screen.rank === editPageRank
              ? { ...screen, ...editedScreen }
              : screen,
          );

          onChange(newScreens);
          setEditPageRank(null);
        }}
      />
    </>
  );
}
