import Link from "next/link";
import OhditLogo from "../../layout/components/OhditLogo";
import styles from "../styles/login_form.module.css";
import formStyles from "@/src/components/form/styles/form.module.css";
import { FaceFrownIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import { useLogin } from "../mutations/useLogin";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getErrorsForField,
} from "@/src/design-system/utils/form/formErrors";
import Form from "@/src/design-system/components/form/Form";
import FormRow from "@/src/design-system/components/form/FormRow";
import Label from "@/src/design-system/components/form/Label";
import Input from "@/src/design-system/components/form/input/Input";
import Button from "@/src/design-system/components/button/Button";
import PasswordInput from "@/src/design-system/components/form/input/PasswordInput";

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
      document.cookie = `auth_token=${data.token}; path=/; max-age=864000; SameSite=None; Secure`;

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
        Si vous n'avez pas encore de compte, vous pouvez{" "}
        <Link prefetch={false} href={`/inscription`}>vous inscrire à la bêta</Link>.
        Ohdit reste gratuit pendant toute la durée de la bêta.
      </p>
      <Form
        // className={`${formStyles.form} ${styles.loginForm}`}
        onSubmit={onSubmit}
      >
        <FormRow>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            value={email}
            autocomplete="email"
            onChange={(newEmail) => {
              setEmail(newEmail);
              cleanErrors("email");
            }}
            required={true}
            errors={getErrorsForField("email", errors)}
          />
        </FormRow>
        <FormRow>
          <Label htmlFor="password">Mot de passe</Label>
          <PasswordInput
            name="password"
            value={password}
            autocomplete="current-password"
            onChange={(newPassword) => {
              setPassword(newPassword);
              cleanErrors("password");
            }}
            required={true}
            errors={getErrorsForField("password", errors)}
            withRequirements={false}
          />
          <Link
            href={`/mot-de-passe-oublie?email=${encodeURIComponent(email)}`}
            className={styles.forgotPasswordLink}
          >
            <FaceFrownIcon />
            J'ai oublié mon mot de passe
          </Link>
        </FormRow>
        <div className={styles.loginButtonContainer}>
          <Button type="submit" disabled={isSubmitting}>
            <LockOpenIcon />
            Se connecter
          </Button>
          <Link prefetch={false} href={`/inscription`}>Créer un compte</Link>
        </div>
      </Form>
    </div>
  );
}
