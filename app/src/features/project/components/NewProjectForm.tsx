import CallToActionButton from "@/src/components/form/CallToActionButon";
import styles from "../../../components/form/styles/form.module.css";
import typographyStyle from "@/src/design-system/styles/typography.module.css";

import {
  DocumentPlusIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { FormEvent, useRef, useState } from "react";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import { useRouter } from "next/navigation";
import {
  CreateScreenPayload,
  useCreateProject,
} from "../mutations/useCreateProject";
import { useTeamsStateStore } from "../../authentication/store/teamsStore";
import ErrorBox from "../../error_handling/components/ErrorBox";
import { getProjectUrl } from "@/src/app/projet/routing";
import { useFetchRuleSets } from "../../rule_set/queries/useFetchRuleSets";
import { RuleSet } from "../../rule_set/types/RuleSetTypes";

function getErrorsForField(
  fieldName: string,
  errors: ApiValidationError[],
): ApiValidationError[] {
  return errors.filter((error) => error.propertyPath === fieldName);
}

function hasFieldError(
  fieldName: string,
  errors: ApiValidationError[],
): boolean {
  return getErrorsForField(fieldName, errors).length > 0;
}

export default function NewProjectForm() {
  const defaultPages: CreateScreenPayload[] = [
    { name: "Accueil", url: "/", rank: 1 },
    { name: "Contact", url: "/contact", rank: 2 },
    { name: "Mentions légales", url: "/mentions-legales", rank: 3 },
    {
      name: "Déclaration d'accessibilité",
      url: "/declaration-accessibilite",
      rank: 4,
    },
    { name: "Plan du site", url: "/plan-du-site", rank: 5 },
    { name: "Aide", url: "/aide", rank: 6 },
    { name: "Authentification", url: "/login", rank: 7 },
  ];

  const [pages, setPages] = useState<CreateScreenPayload[]>(defaultPages);

  const [errors, setErrors] = useState<ApiValidationError[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [editPageRank, setEditPageRank] = useState<number | null>(null);

  const [pageName, setPageName] = useState<string>("");
  const [pageUrl, setPageUrl] = useState<string>("");

  const teamUuid = useTeamsStateStore((state) => state.currentTeamUuid!);

  const {
    data: ruleSets,
    isLoading: isRuleSetsLoading,
    error: ruleSetsError,
  } = useFetchRuleSets();

  const createProject = useCreateProject(teamUuid);

  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  if (isRuleSetsLoading) {
    return null;
  }

  if (ruleSetsError) {
    return (
      <ErrorBox message="Une erreur est survenue lors du chargement des référentiels d'audit." />
    );
  }

  if (!teamUuid) {
    return <ErrorBox message="Aucune équipe sélectionnée." />;
  }

  if (!teamUuid) {
    return <ErrorBox message="Aucune équipe sélectionnée." />;
  }

  const onSubmitProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const screens = pages;
    const ruleSetUuid = formData.get("ruleSets") as string;

    try {
      const newProject = await createProject.mutateAsync({
        teamUuid,
        name,
        url,
        ruleSetUuid,
        screens,
      });

      router.push(getProjectUrl.dashboard(newProject.uuid));
    } catch (apiError) {
      if (apiError instanceof ApiError) {
        setErrors(apiError.errors || []);

        document
          .getElementById(apiError.errors?.[0]?.propertyPath || "")
          ?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const pageName = formData.get("page-name") as string;
    const pageUrl = formData.get("page-url") as string;

    if (pageName.trim() === "") {
      setErrors([
        ...errors,
        {
          propertyPath: "page-name",
          message: "Le nom de la page est requis.",
          code: "REQUIRED",
        },
      ]);

      document.getElementById("page-name")?.focus();

      return;
    }

    if (editPageRank !== null) {
      const newPages = pages.map((page) =>
        page.rank === editPageRank
          ? { ...page, name: pageName, url: pageUrl }
          : page,
      );
      setPages(newPages);
      setEditPageRank(null);
    } else {
      const newPage: CreateScreenPayload = {
        name: pageName,
        url: pageUrl,
        rank: pages.length + 1,
      };
      setPages([...pages, newPage]);
    }

    setPageName("");
    setPageUrl("");

    document.getElementById("page-name")?.focus();
  };

  const cleanErrors = (fieldName: string) => {
    setErrors(errors.filter((error) => error.propertyPath !== fieldName));
  };

  const movePageUp = (rank: number) => {
    if (rank === 1) return;

    const newPages = [...pages];
    const index = newPages.findIndex((page) => page.rank === rank);
    const temp = newPages[index - 1];
    newPages[index - 1] = newPages[index];
    newPages[index] = temp;

    newPages[index - 1].rank = rank - 1;
    newPages[index].rank = rank;

    setPages(newPages);

    document.getElementById(`move-page-up-${rank - 1}`)?.focus();
  };

  const movePageDown = (rank: number) => {
    if (rank === pages.length) return;

    const newPages = [...pages];
    const index = newPages.findIndex((page) => page.rank === rank);
    const temp = newPages[index + 1];
    newPages[index + 1] = newPages[index];
    newPages[index] = temp;

    newPages[index + 1].rank = rank + 1;
    newPages[index].rank = rank;

    setPages(newPages);

    document.getElementById(`move-page-down-${rank + 1}`)?.focus();
  };

  const editPage = (rank: number) => {
    const pageToEdit = pages.find((page) => page.rank === rank);
    if (!pageToEdit) return;

    setPageName(pageToEdit.name);
    setPageUrl(pageToEdit.url || "");
    setEditPageRank(rank);

    document.getElementById("page-name")?.focus();
  };

  const removePage = (rank: number) => {
    const newPages = pages
      .filter((page) => page.rank !== rank)
      .map((page, index) => ({
        ...page,
        rank: index + 1,
      }));

    setPages(newPages);
  };

  return (
    <div className={styles.formContainer}>
      <form
        ref={formRef}
        className={styles.form}
        noValidate={true}
        onSubmit={onSubmitProject}
      >
        <p aria-hidden={true} className={styles.requiredFields}>
          Les champs suivis d'une <span className={styles.requiredStar}>*</span>{" "}
          sont obligatoires.
        </p>

        <label htmlFor="name">
          Nom du projet
          <span aria-hidden={true} className={styles.requiredStar}>
            *
          </span>{" "}
          :
        </label>
        <input
          aria-required={true}
          onChange={() => cleanErrors("name")}
          id="name"
          name="name"
          type="text"
          aria-invalid={hasFieldError("name", errors)}
          aria-describedby={
            hasFieldError("name", errors) ? "name-error" : undefined
          }
          className={hasFieldError("name", errors) ? styles.inputError : ""}
        />
        {hasFieldError("name", errors) && (
          <p id="name-error" className={styles.fieldError}>
            {getErrorsForField("name", errors).map((error) => error.message)}
          </p>
        )}

        <label htmlFor="url">Url du site à auditer :</label>
        <input
          aria-required={false}
          onChange={() => cleanErrors("url")}
          id="url"
          name="url"
          type="text"
          aria-invalid={hasFieldError("url", errors)}
          aria-describedby={
            hasFieldError("url", errors) ? "url-error" : undefined
          }
          className={hasFieldError("url", errors) ? styles.inputError : ""}
        />
        {hasFieldError("url", errors) && (
          <p id="url-error" className={styles.fieldError}>
            {getErrorsForField("url", errors).map((error) => error.message)}
          </p>
        )}

        <fieldset>
          <legend>
            Référentiel de l'audit
            <span className={styles.requiredStar} aria-hidden="true">
              *
            </span>
            :
            <p className={styles.fieldsetInfo}>
              Pour l'instant seul le RGAA 4.1.2 est disponible, mais d'autres
              référentiels (RAAM, RGESN, etc.) arriveront bientôt !
            </p>
          </legend>
          <ul>
            {ruleSets?.map((ruleSet: RuleSet) => (
              <li key={ruleSet.uuid}>
                <div
                  className={styles.inputContainer}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "15px",
                    flexDirection: "row",
                  }}
                >
                  <input
                    type="radio"
                    id={`ruleSet-${ruleSet.uuid}`}
                    name="ruleSets"
                    style={{ marginTop: "7px" }}
                    value={ruleSet.uuid}
                    defaultChecked={ruleSet.name === "RGAA"}
                  />
                  <label htmlFor={`ruleSet-${ruleSet.uuid}`}>
                    {ruleSet.name}{" "}
                    {ruleSet.version ? `- v${ruleSet.version}` : ""}
                    <br />
                    <em style={{ maxWidth: "550px", display: "inline-block" }}>
                      {ruleSet.description}
                    </em>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend>
            Pages à auditer
            <span className={styles.requiredStar} aria-hidden="true">
              *
            </span>
            :
            <p className={styles.fieldsetInfo}>
              Au moins une page est requise. Les pages sont pré-remplies avec{" "}
              <a
                aria-label="l'échantillon de pages par défaut nécessaires à un audit RGAA, nouvelle fenêtre"
                className={typographyStyle.externalLink}
                href="https://accessibilite.numerique.gouv.fr/obligations/evaluation-conformite/"
              >
                l'échantillon de pages par défaut nécessaires à un audit RGAA
                <ArrowTopRightOnSquareIcon />
              </a>
              , vous pourrez aussi les modifier plus tard.
            </p>
          </legend>
          <ul>
            <li>
              <div className={styles.inputContainer}>
                <span className={styles.fieldsetListIndex} aria-hidden="true">
                  1.
                </span>

                <span className="py-2 font-medium">
                  Éléments transverses (toujours inclus dans l'audit)
                </span>
              </div>
            </li>
            {pages.map((page, index) => (
              <li key={index}>
                <div className={styles.inputContainer}>
                  <span className={styles.fieldsetListIndex} aria-hidden="true">
                    {page.rank + 1}.
                  </span>

                  <span style={{ flex: 1 }}>
                    {page.name}
                    <br />
                    {page.url && (
                      <>
                        <span
                          style={{
                            color: "#555555",
                            fontStyle: "italic",
                            fontSize: "16px",
                          }}
                        >
                          {page.url}
                        </span>
                      </>
                    )}
                  </span>

                  <CallToActionButton
                    id={`move-page-up-${page.rank}`}
                    type="button"
                    className={styles.smallButton}
                    ariaLabel={
                      page.rank === 1
                        ? `Monter la page "${page.name}" (impossible car déjà en première position).`
                        : `Monter la page "${page.name}" en position ${
                            page.rank - 1
                          }.`
                    }
                    onClick={() => {
                      if (page.rank === 1) {
                        return;
                      }
                      movePageUp(page.rank);
                    }}
                  >
                    <ArrowUpIcon />
                  </CallToActionButton>

                  <CallToActionButton
                    id={`move-page-down-${page.rank}`}
                    type="button"
                    className={styles.smallButton}
                    ariaLabel={
                      page.rank === pages.length
                        ? `Descendre la page "${page.name}" (impossible car déjà en dernière position).`
                        : `Descendre la page "${page.name}" en position ${
                            page.rank + 1
                          }.`
                    }
                    onClick={() => {
                      if (page.rank === pages.length) {
                        return;
                      }
                      movePageDown(page.rank);
                    }}
                  >
                    <ArrowDownIcon />
                  </CallToActionButton>

                  <CallToActionButton
                    type="button"
                    className={styles.smallButton}
                    ariaLabel={`Modifier la page ${index + 1} "${page.name}"`}
                    onClick={() => editPage(page.rank)}
                  >
                    <PencilSquareIcon />
                  </CallToActionButton>

                  <CallToActionButton
                    ariaLabel={`Supprimer la page ${index + 1} "${page.name}"`}
                    type="button"
                    className={styles.smallButton}
                    onClick={() => {
                      removePage(page.rank);
                    }}
                  >
                    <TrashIcon />
                  </CallToActionButton>

                  {hasFieldError(`screens[${index}]`, errors) && (
                    <p
                      id={`screens-${index}-error`}
                      className={styles.fieldError}
                    >
                      {getErrorsForField(`screens[${index}]`, errors).map(
                        (error) => error.message,
                      )}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </fieldset>
      </form>

      <form className={styles.form} noValidate={true} onSubmit={onSubmitPage}>
        <h2 className="h3">
          {editPageRank !== null
            ? `Modifier la page ${editPageRank}`
            : "Ajouter une page"}
        </h2>

        <label htmlFor="page-name">
          Nom de la page
          <span aria-hidden={true} className={styles.requiredStar}>
            *
          </span>{" "}
          :
        </label>
        <input
          aria-required={true}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            cleanErrors("page-name");
            setPageName(e.target.value);
          }}
          id="page-name"
          name="page-name"
          type="text"
          value={pageName}
          aria-invalid={hasFieldError("page-name", errors)}
          aria-describedby={
            hasFieldError("page-name", errors) ? "page-name-error" : undefined
          }
          className={
            hasFieldError("page-name", errors) ? styles.inputError : ""
          }
        />
        {hasFieldError("page-name", errors) && (
          <p id="page-name-error" className={styles.fieldError}>
            {getErrorsForField("page-name", errors).map(
              (error) => error.message,
            )}
          </p>
        )}

        <label htmlFor="page-url">Url de la page :</label>
        <input
          aria-required={false}
          value={pageUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            cleanErrors("page-url");
            setPageUrl(e.target.value);
          }}
          id="page-url"
          name="page-url"
          type="text"
          aria-invalid={hasFieldError("page-url", errors)}
          aria-describedby={
            hasFieldError("page-url", errors) ? "page-url-error" : undefined
          }
          className={hasFieldError("page-url", errors) ? styles.inputError : ""}
        />
        {hasFieldError("page-url", errors) && (
          <p id="page-url-error" className={styles.fieldError}>
            {getErrorsForField("page-url", errors).map(
              (error) => error.message,
            )}
          </p>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <CallToActionButton
            type="submit"
            className={`${styles.fieldsetButton}`}
          >
            {editPageRank === null && (
              <>
                <DocumentPlusIcon />
                Ajouter une page
              </>
            )}
            {editPageRank !== null && (
              <>
                <PencilSquareIcon />
                Modifier la page
              </>
            )}
          </CallToActionButton>

          {editPageRank !== null && (
            <CallToActionButton
              type="button"
              className={`${styles.fieldsetButton}`}
              onClick={() => {
                setPageName("");
                setPageUrl("");
                setEditPageRank(null);

                document.getElementById("page-name")?.focus();
              }}
            >
              <XMarkIcon />
              Annuler
            </CallToActionButton>
          )}
        </div>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <CallToActionButton
        disabled={isLoading}
        onClick={() => formRef.current?.requestSubmit()}
      >
        <PlusIcon />
        Ajouter l'audit
      </CallToActionButton>
    </div>
  );
}
