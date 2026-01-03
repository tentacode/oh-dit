import Link from "next/link";
import OhditLogo from "../../layout/components/OhditLogo";
import styles from "../styles/login_form.module.css";
import formStyles from "@/src/components/form/styles/form.module.css";
import { EnvelopeIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import CallToActionButton from "@/src/components/form/CallToActionButon";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import { useSearchParams } from "next/navigation";
import { useForgotPassword } from "../mutations/useForgotPassword";
import ForgotPasswordSuccessIllustration from "./ForgotPasswordSuccessIllustration";

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

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const loginEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(loginEmail);
  const [errors, setErrors] = useState<ApiValidationError[]>([]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [success, setSuccess] = useState<boolean>(false);

  const forgotPassword = useForgotPassword();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setErrors([]);

    setIsSubmitting(true);

    try {
      await forgotPassword.mutateAsync({
        email,
      });

      setSuccess(true);
    } catch (apiError) {
      if (apiError instanceof ApiError) {
        setErrors(apiError.errors || []);
        document.getElementById(errors[0]?.propertyPath)?.focus();
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
      <h1 className={"h2"}>Mot de passe oublié</h1>
      {!success && (<>
      <p className={formStyles.helpText}>
        Pour changer votre mot de passe, renseignez l'adresse email de votre compte Ohdit.
      </p>
      <p className={formStyles.helpText}>
        Vous recevrez ensuite par email un lien pour réinitialiser votre mot de passe.
      </p>
      <form
        noValidate
        className={`${formStyles.form} ${styles.loginForm}`}
        onSubmit={onSubmit}
      >
        <div className={formStyles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            autoComplete="email"
            onChange={(e) => {
              setEmail(e.target.value);
              cleanErrors("email");
            }}
            aria-invalid={hasFieldError("email", errors)}
            aria-required="true"
            aria-describedby="email-errors"
            className={
              hasFieldError("email", errors) ? formStyles.inputError : ""
            }
          />
          {hasFieldError("email", errors) && (
            <p id="email-errors" className={formStyles.fieldError}>
              {getErrorsForField("email", errors).map((error) => (
                <span key={error.message}>{error.message}</span>
              ))}
            </p>
          )}
        </div>
        <div className={styles.loginButtonContainer}>
          <CallToActionButton>
            <EnvelopeIcon />
            Demander un nouveau mot de passe
          </CallToActionButton>
        </div>
      </form>
      </>)}
      {success && (
        <div className={styles.forgotPasswordSuccessContainer}>
          <ForgotPasswordSuccessIllustration />
          <h2 className={'h3'}>Demande envoyée !</h2>
          <p>
            Si un compte existe avec cette adresse email, vous allez recevoir un
            email avec un lien pour réinitialiser votre mot de passe.
          </p>
          <p>
            Si vous avez des difficultés à recevoir cet email, n'hésitez pas à nous contacter par email à
            {' '}<a href="mailto:support@ohdit.com">support@ohdit.com</a>.
          </p>
        </div>
      )}
      <Link
        href={`/login`}
        style={{ marginTop: 16 }}
        className={styles.forgotPasswordLink}
      >
        <FaceSmileIcon />
        Finalement je me rappelle de mon mot de passe
      </Link>
    </div>
  );
}
