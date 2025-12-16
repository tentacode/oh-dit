"use client";

import { useFetchEmailFromToken } from "@/src/features/authentication/queries/useFetchEmailFromToken";
import OhditLogo from "@/src/features/layout/components/OhditLogo";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import styles from "./styles.module.css";
import {
  EnvelopeIcon,
  InformationCircleIcon,
  LockClosedIcon,
  UsersIcon,
  UserIcon,
  RocketLaunchIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import { useRegisterBetaUser } from "@/src/features/authentication/mutations/useCreateProject";
import CallToActionButton from "@/src/components/form/CallToActionButon";

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

function BetaRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [teamName, setTeamName] = useState("");
  const [errors, setErrors] = useState<ApiValidationError[]>([]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const token = searchParams.get("token") || "";

  const registerBetaUser = useRegisterBetaUser();

  const {
    data: emailResponse,
    isLoading,
    isError,
  } = useFetchEmailFromToken(token);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError || !emailResponse) {
    return (
      <div>
        Erreur lors de la récupération de votre email. Le lien est peut-être
        invalide ou expiré.
      </div>
    );
  }

  const email = emailResponse.email;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setErrors([]);

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;
      const teamName = formData.get("teamName") as string;

      await registerBetaUser.mutateAsync({
        token,
        username,
        password,
        teamName,
      });

      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/login_check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!loginResponse.ok) {
        throw new Error("Erreur lors de la connexion après l'inscription");
      }

      const data = await loginResponse.json();

      // Stocker le token dans un cookie
      document.cookie = `auth_token=${data.token}; path=/; max-age=864000; SameSite=Strict`;

      // Rediriger vers la homepage
      router.push(redirect);
    } catch (apiError) {
      if (apiError instanceof ApiError) {
        setErrors(apiError.errors || []);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanErrors = (fieldName: string) => {
    setErrors(errors.filter((error) => error.propertyPath !== fieldName));
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div>
        <div
          style={{ width: 200, marginTop: 40 }}
          className="flex mx-auto mb-5"
        >
          <OhditLogo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Inscription à la bêta
        </h2>
      </div>

      <div className={styles.formContainer}>
        <div className="bg-white px-6 pb-12 pt-10 shadow-sm sm:rounded-lg sm:px-12 mb-20">
          <form
            noValidate={true}
            onSubmit={handleSubmit}
            className={styles.form}
          >
            <p>
              Tous les champs sont obligatoires, et pourront être modifiés plus
              tard.
            </p>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                <EnvelopeIcon aria-hidden="true" />
                Adresse email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={hasFieldError("email", errors)}
                  value={email}
                  disabled={true}
                  aria-describedby="email-help"
                  className={`${styles.inputDisabled} ${styles.input}`}
                />
              </div>
              { hasFieldError("email", errors) && (
              <p id="email-help" className={styles.helpText}>
                <InformationCircleIcon aria-hidden="true" />
                <span>
                  Vous pourrez modifier cette adresse email dans les paramètres
                  de votre compte.
                </span>
              </p>
              )}

              {hasFieldError("email", errors) && (
                <p
                  id="email-help"
                  className={`${styles.helpText} ${styles.errorText}`}
                >
                  <ExclamationTriangleIcon aria-hidden="true" />
                  <span>
                    {getErrorsForField("email", errors)
                      .map((error) => error.message)
                      .join(" ")}
                  </span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                <LockClosedIcon aria-hidden="true" />
                <span>Mot de passe</span>
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  aria-describedby="password-help"
                  aria-invalid={hasFieldError("password", errors)}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    cleanErrors("password");
                    setPassword(e.target.value);
                  }}
                  className={styles.input}
                />
              </div>

              {hasFieldError("password", errors) && (
                <p
                  id="password-help"
                  className={`${styles.helpText} ${styles.errorText}`}
                >
                  <ExclamationTriangleIcon aria-hidden="true" />
                  <span>
                    {getErrorsForField("password", errors)
                      .map((error) => error.message)
                      .join(" ")}
                  </span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900"
              >
                <UserIcon aria-hidden="true" />
                Nom d'utilisateur·ice
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  aria-describedby="username-help"
                  aria-invalid={hasFieldError("username", errors)}
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    cleanErrors("username");
                    setUsername(e.target.value);
                  }}
                  className={styles.input}
                />
              </div>
              {!hasFieldError("username", errors) && (
                <p id="username-help" className={styles.helpText}>
                  <InformationCircleIcon />
                  <span>
                    Ça peut être votre nom et votre prénom, votre prénom ou un
                    pseudonyme. C'est ce qui sera affiché à côté de vos
                    commentaires, par exemple.
                  </span>
                </p>
              )}

              {hasFieldError("username", errors) && (
                <p
                  id="username-help"
                  className={`${styles.helpText} ${styles.errorText}`}
                >
                  <ExclamationTriangleIcon aria-hidden="true" />
                  <span>
                    {getErrorsForField("username", errors)
                      .map((error) => error.message)
                      .join(" ")}
                  </span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="teamName"
                className="block text-sm/6 font-medium text-gray-900"
              >
                <UsersIcon aria-hidden="true" />
                Nom de l'équipe
              </label>
              <div className="mt-2">
                <input
                  id="teamName"
                  name="teamName"
                  type="text"
                  aria-describedby="teamName-help"
                  aria-invalid={hasFieldError("teamName", errors)}
                  required
                  autoComplete="organization"
                  value={teamName}
                  onChange={(e) => {
                    cleanErrors("teamName");
                    setTeamName(e.target.value);
                  }}
                  className={styles.input}
                />
              </div>

              {!hasFieldError("teamName", errors) && (
                <p id="teamName-help" className={styles.helpText}>
                  <InformationCircleIcon aria-hidden="true" />
                  <span>
                    Ça peut être le nom de votre société ou de votre équipe.
                    <br />
                    Exemple : "Les Chatons Mignons".
                  </span>
                </p>
              )}

              {hasFieldError("teamName", errors) && (
                <p
                  id="teamName-help"
                  className={`${styles.helpText} ${styles.errorText}`}
                >
                  <ExclamationTriangleIcon aria-hidden="true" />
                  <span>
                    {getErrorsForField("teamName", errors)
                      .map((error) => error.message)
                      .join(" ")}
                  </span>
                </p>
              )}
            </div>

            <CallToActionButton type="submit" disabled={isSubmitting}>
              <RocketLaunchIcon aria-hidden="true" />
              Créer mon compte
            </CallToActionButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function BetaRegisterPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <BetaRegisterForm />
    </Suspense>
  );
}
