import Link from "next/link";
import OhditLogo from "../../layout/components/OhditLogo";
import styles from "../styles/login_form.module.css";
import formStyles from "@/src/components/form/styles/form.module.css";
import {
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import CallToActionButton from "@/src/components/form/CallToActionButon";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "../mutations/useResetPassword";

function getErrorsForField(
  fieldName: string,
  errors: ApiValidationError[]
): ApiValidationError[] {
  return errors.filter((error) => error.propertyPath === fieldName);
}

function hasFieldError(
  fieldName: string,
  errors: ApiValidationError[]
): boolean {
  return getErrorsForField(fieldName, errors).length > 0;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ApiValidationError[]>([]);
  const [invalidToken, setInvalidToken] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const resetPassword = useResetPassword();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setErrors([]);

    setIsSubmitting(true);

    if (newPassword !== confirmPassword) {
      setErrors([
        {
          code: "password_mismatch",
          propertyPath: "confirmPassword",
          message: "Les mots de passe ne correspondent pas.",
        },
      ]);

      setIsSubmitting(false);
      return;
    }

    try {
      const data = await resetPassword.mutateAsync({
        token,
        newPassword,
      });

      document.cookie = `auth_token=${data.token}; path=/; max-age=864000; SameSite=Strict`;

      router.push('/');
    } catch (apiError) {
      if (apiError instanceof ApiError) {
        setErrors(apiError.errors || []);
        document.getElementById((apiError.errors ||[])[0]?.propertyPath)?.focus();

        console.log("API Error message:", apiError.message);
        if (apiError.message == 'No user found with the given token.' ||
            apiError.message == 'Le token de réinitialisation a expiré.'
        ) {
          setInvalidToken(true);
        }        
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanErrors = (fieldName: string) => {
    setErrors(errors.filter((error) => error.propertyPath !== fieldName));
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logo}>
        <OhditLogo />
      </div>
      <h1 className={"h2"}>Changement de mot de passe</h1>
      <p className={formStyles.helpText}>
        Une fois votre nouveau mot de passe enregistré, vous serez
        automatiquement redirigé·e vers Ohdit.
      </p>
      <form
        noValidate
        className={`${formStyles.form} ${styles.loginForm}`}
        onSubmit={onSubmit}
      >
        <div className={formStyles.inputGroup}>
          <label htmlFor="newPassword">Nouveau mot de passe</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            autoComplete="password"
            onChange={(e) => {
              setNewPassword(e.target.value);
              cleanErrors("newPassword");
            }}
            aria-invalid={hasFieldError("newPassword", errors)}
            aria-required="true"
            aria-describedby="newPassword-errors"
            className={
              hasFieldError("newPassword", errors) ? formStyles.inputError : ""
            }
          />
          {hasFieldError("newPassword", errors) && (
            <p id="newPassword-errors" className={formStyles.fieldError}>
              {getErrorsForField("newPassword", errors).map((error) => (
                <span key={error.message}>{error.message}</span>
              ))}
            </p>
          )}
        </div>

        <div className={formStyles.inputGroup}>
          <label htmlFor="confirmPassword">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            autoComplete="new-password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              cleanErrors("confirmPassword");
            }}
            aria-invalid={hasFieldError("confirmPassword", errors)}
            aria-required="true"
            aria-describedby="confirmPassword-errors"
            className={
              hasFieldError("confirmPassword", errors)
                ? formStyles.inputError
                : ""
            }
          />
          {hasFieldError("confirmPassword", errors) && (
            <p id="confirmPassword-errors" className={formStyles.fieldError}>
              {getErrorsForField("confirmPassword", errors).map((error) => (
                <span key={error.message}>{error.message}</span>
              ))}
            </p>
          )}
        </div>

        {invalidToken && (
          <div className={formStyles.warningText} role="alert">
            <XMarkIcon />
            <span>
              Le lien de réinitialisation du mot de passe est invalide ou a
              expiré. Vous pouvez refaire une demande sur {" "}
              <Link href="/mot-de-passe-oublie" className="underline">
                la page de mot de passe oublié
              </Link>
              .
            </span>
          </div>
        )}

        <div className={styles.loginButtonContainer}>
          <CallToActionButton>
            <LockClosedIcon />
            Je change mon mot de passe
          </CallToActionButton>
        </div>
      </form>
    </div>
  );
}
