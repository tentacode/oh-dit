import CallToActionButton from "@/src/components/form/CallToActionButon";
import styles from "../../../components/form/styles/form.module.css";
import {
  FolderPlusIcon,
  DocumentPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import { useRouter } from "next/navigation";
import { useCreateProject } from "../mutations/useCreateProject";

function getErrorsForField(fieldName: string, errors: ApiValidationError[]): ApiValidationError[] {
  return errors.filter((error) => error.propertyPath === fieldName);
}

function hasFieldError(fieldName: string, errors: ApiValidationError[]): boolean {
  return getErrorsForField(fieldName, errors).length > 0;
}

export default function NewProjectForm() {
  const defaultPages = [
    "Accueil",
    "Contact",
    "Mentions légales",
    "Déclaration d'accessibilité",
    "Plan du site",
    "Aide",
    "Authentification",
  ];

  const [pages, setPages] = useState<string[]>(defaultPages);

  const [errors, setErrors] = useState<ApiValidationError[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createProject = useCreateProject();

  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const screens = pages;

    try {
      await createProject.mutateAsync({ name, screens });

      router.push(`/?success=${encodeURIComponent(`L'audit pour le projet "${name}" a été créé.`)}`);
    } catch (apiError) {
      if (apiError instanceof ApiError) {
        setErrors(apiError.errors || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cleanErrors =
    (fieldName: string) => {
      setErrors(errors.filter((error) => error.propertyPath !== fieldName));
    };

  return (
    <form noValidate={true} className={styles.form} onSubmit={onSubmit}>
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
          <li>
              <div className={styles.inputContainer}>
            <input
              type="checkbox"
              id="ruleSet-rgaa"
              name="ruleSets"
              defaultValue="rgaa"
              disabled={true}
              checked={true}
            />
            <label htmlFor="ruleSet-rgaa">RGAA 4.1.2</label>
          </div>
          </li>
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
            Au moins une page est requise. Les pages sont pré-remplies avec des
            pages par défaut nécessaires à un audit RGAA, vous pouvez les
            modifier plus tard.
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
                  {index + 2}.
                </span>

                <input
                  id={`page-${index}`}
                  type="text"
                  name={`screens[${index}]`}
                  value={page}
                  arial-label={`Nom de la page ${index + 2}`}
                  aria-required={true}
                  aria-invalid={hasFieldError(`screens[${index}]`, errors)}
                  aria-describedby={
                    hasFieldError(`screens[${index}]`, errors)
                      ? `screens-${index}-error`
                      : undefined
                  }
                  className={
                    hasFieldError(`screens[${index}]`, errors)
                      ? styles.inputError
                      : ""
                  }
                  onChange={(e) => {
                    cleanErrors(`screens[${index}]`);

                    const newPages = [...pages];
                    newPages[index] = e.target.value;
                    setPages(newPages);
                  }}
                />

                <CallToActionButton
                  ariaLabel={`Supprimer la page ${index + 1}: ${page}`}
                  type="button"
                  className={styles.fieldsetButton}
                  onClick={(e) => {
                    e.preventDefault();

                    cleanErrors(`screens[${index}]`);
                    
                    const newPages = pages.filter((_, i) => i !== index);
                    setPages(newPages);
                  }}
                >
                  <TrashIcon />
                  supprimer
                </CallToActionButton>

                {hasFieldError(`screens[${index}]`, errors) && (
                  <p id={`screens-${index}-error`} className={styles.fieldError}>
                    {getErrorsForField(`screens[${index}]`, errors).map(
                      (error) => error.message
                    )}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <CallToActionButton
          type="button"
          className={`${styles.fieldsetButton} ml-8`}
          onClick={(e) => {
            e.preventDefault();
            setPages([...pages, ""]);

            // Focus new input
            setTimeout(() => {
              const newIndex = pages.length;
              const newInput = document.getElementById(`page-${newIndex}`);
              newInput?.focus();
            }, 100);
          }}
        >
          <DocumentPlusIcon />
          Ajouter une page
        </CallToActionButton>
      </fieldset>

      <hr />

      <CallToActionButton
          disabled={isLoading}
        >
          <FolderPlusIcon />
          Ajouter l'audit
      </CallToActionButton>
    </form>
  );
}
