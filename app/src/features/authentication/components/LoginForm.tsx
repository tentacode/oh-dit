import Link from "next/link";
import OhditLogo from "../../layout/components/OhditLogo";
import styles from "../styles/login_form.module.css";
import formStyles from "@/src/components/form/styles/form.module.css";
import { FaceFrownIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import CallToActionButton from "@/src/components/form/CallToActionButon";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import { useLogin } from "../mutations/useLogin";
import { useRouter, useSearchParams } from "next/navigation";

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

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ApiValidationError[]>([]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const login = useLogin();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setErrors([]);

    setIsSubmitting(true);

    try {
      const data = await login.mutateAsync({
        email,
        password,
      });

      // Stocker le token dans un cookie
      document.cookie = `auth_token=${data.token}; path=/; max-age=864000; SameSite=Strict`;

      // Rediriger vers la page demandée
      router.push(redirect);
    } catch (apiError) {
      if (apiError instanceof ApiError) {
        setErrors(apiError.errors || []);
      }

      const errors = [];

      // @ts-expect-error ça me saoule typescript
      if (apiError.message === 'The key "email" must be a non-empty string.') {
        errors.push({
          code: "bad_request",
          propertyPath: "email",
          message: "L'email est obligatoire.",
        });
      }

      if (
        // @ts-expect-error ça me saoule typescript
        apiError.message === 'The key "password" must be a non-empty string.'
      ) {
        errors.push({
          code: "bad_request",
          propertyPath: "password",
          message: "Le mot de passe est obligatoire.",
        });
      }

      // Identifiants invalides.

      // @ts-expect-error ça me saoule typescript
      if (apiError.message.includes("NEXT_REDIRECT")) {
        errors.push({
          code: "invalid_credentials",
          propertyPath: "email",
          message: "Email ou mot de passe incorrect.",
        });
      }

      if (errors.length > 0) {
        setErrors(errors);
        document.getElementById(errors[0].propertyPath)?.focus();
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
      <h1 className={"h2"}>Connectez-vous à la bêta</h1>
      <p className={formStyles.helpText}>
        La bêta d'Ohdit est sur invitation uniquement. Si vous voulez en
        faire partie, n'hésitez pas à nous envoyer votre demande sur <a href="mailto:beta@ohdit.com">beta@ohdit.com</a>.
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
        <div className={formStyles.inputGroup}>
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => {
              setPassword(e.target.value);
              cleanErrors("password");
            }}
            aria-invalid={hasFieldError("password", errors)}
            aria-required="true"
            aria-describedby="password-errors"
            className={
              hasFieldError("password", errors) ? formStyles.inputError : ""
            }
          />
          {hasFieldError("password", errors) && (
            <p id="password-errors" className={formStyles.fieldError}>
              {getErrorsForField("password", errors).map((error) => (
                <span key={error.message}>{error.message}</span>
              ))}
            </p>
          )}
          <Link
            href={`/mot-de-passe-oublie?email=${encodeURIComponent(email)}`}
            className={styles.forgotPasswordLink}
          >
            <FaceFrownIcon />
            J'ai oublié mon mot de passe
          </Link>
        </div>
        <div className={styles.loginButtonContainer}>
          <CallToActionButton>
            <LockOpenIcon />
            Se connecter
          </CallToActionButton>
        </div>
      </form>
    </div>
  );
}
