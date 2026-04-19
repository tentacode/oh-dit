import Link from "next/link";
import OhditLogo from "../../layout/components/OhditLogo";
import styles from "../styles/login_form.module.css";
import formStyles from "@/src/components/form/styles/form.module.css";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import {
  getErrorsForField,
} from "@/src/design-system/utils/form/formErrors";
import Form from "@/src/design-system/components/form/Form";
import FormRow from "@/src/design-system/components/form/FormRow";
import Label from "@/src/design-system/components/form/Label";
import Input from "@/src/design-system/components/form/input/Input";
import Button from "@/src/design-system/components/button/Button";
import { useSendConfirmationLink } from "../mutations/useSendConfirmationLink";

export default function AskForAccountForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ApiValidationError[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const sendConfirmationLink = useSendConfirmationLink();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setErrors([]);

    setIsSubmitting(true);

    try {
      await sendConfirmationLink.mutateAsync({ email });

      setIsSuccess(true);
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

  const instructionsStyle = {
    margin: 0,
    fontStyle: "italic",
  }

  const loveLetterStyle = {
    fontSize: "5rem",
    margin: 0,
  }

  const successRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        successRef.current?.focus();
      }, 100);
    }
  }, [isSuccess]);

  if (isSuccess) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.logo}>
          <OhditLogo />
        </div>
        <h1 className={"h2"}>Inscription à la bêta</h1>
        <p style={loveLetterStyle} aria-hidden="true">💌</p>
        <p ref={successRef} tabIndex={-1}>
          Un email de confirmation a été envoyé à <strong>{email}</strong>. Il ne vous reste plus qu'à cliquer sur le lien dans cet email pour finaliser votre inscription.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logo}>
        <OhditLogo />
      </div>
      <h1 className={"h2"}>Inscription à la bêta</h1>
      <p className={formStyles.helpText}>
        Si vous avez déjà un compte, vous pouvez{" "}
        <Link prefetch={false} href={`/connexion`}>vous connecter</Link>.
      </p>
      <p style={instructionsStyle}>
        Ohdit est gratuit pendant toute la durée de la bêta, nous avons juste besoin de votre adresse email pour créer votre compte.
      </p>
      <p style={instructionsStyle}>
        Nous vous enverrons un email avec un lien de confirmation pour finaliser votre inscription.
      </p>
      <Form
        // className={`${formStyles.form} ${styles.loginForm}`}
        onSubmit={onSubmit}
      >
        <FormRow>
          <Label htmlFor="email">Votre Email</Label>
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
        <div className={styles.loginButtonContainer}>
          <Button type="submit" disabled={isSubmitting}>
            <EnvelopeIcon />
            Envoyer le lien de confirmation
          </Button>
        </div>
      </Form>
    </div>
  );
}
