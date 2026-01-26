import Button from "@/src/design-system/components/button/Button";
import Form from "@/src/design-system/components/form/Form";
import FormRow from "@/src/design-system/components/form/FormRow";
import PasswordInput from "@/src/design-system/components/form/input/PasswordInput";
import Label from "@/src/design-system/components/form/Label";
import { LockOpenIcon } from "@heroicons/react/24/outline";
import centeredContainerStyles from "@/src/design-system/styles/layout/centered_container.module.css";
import typographyStyles from "@/src/design-system/styles/typography.module.css";
import { useRef, useState } from "react";
import { useLoginSecuredLink } from "../../mutations/useLoginSecuredLink";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import { setSecuredLinkJwt } from "../../lib/securedLinkAuth";
import OhditLogo from "@/src/features/layout/components/OhditLogo";

// @TODO refacto
function getErrorsForField(
  fieldName: string,
  errors: ApiValidationError[],
): ApiValidationError[] {
  return errors.filter((error) => error.propertyPath === fieldName);
}

export default function SecuredReportPasswordForm({
  linkToken,
}: {
  linkToken: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [errors, setErrors] = useState<ApiValidationError[]>([]);

  const passwordRef = useRef<HTMLInputElement>(null);

  const loginSecuredLink = useLoginSecuredLink();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrors([]);
    setIsSubmitting(true);

    try {
      const jwtResponse = await loginSecuredLink.mutateAsync({
        linkToken: linkToken,
        password: passwordValue,
      });

      setSecuredLinkJwt(linkToken, jwtResponse.token);

      // Reload the page to fetch the secured report with the new JWT
      window.location.reload();
    } catch (apiError) {
      if (apiError instanceof ApiError) {
        setErrors(apiError.errors || []);

        if (apiError.errors) {
          passwordRef?.current?.focus();
        }
      } else {
        setErrors([
          {
            code: "invalid",
            message:
              "Mot de passe incorrect. En cas de doute, vous pouvez contacter l'expéditeur du rapport.",
            propertyPath: "password",
          },
        ]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full flex flex-col items-center">
      <div className={centeredContainerStyles.centeredContainer}>
        <div className={centeredContainerStyles.logo}>
          <OhditLogo />
        </div>
        <h1 className="h2">Accès au rapport sécurisé</h1>
        <p className={typographyStyles.info}>
          Le rapport d'audit qui vous a été transmis est sécurisé par un mot de
          passe.
        </p>
        <Form onSubmit={onSubmit}>
          <FormRow>
            <Label htmlFor="password" required={true}>
              Mot de passe
            </Label>
            <PasswordInput
              onChange={setPasswordValue}
              name="password"
              value={passwordValue}
              ref={passwordRef}
              required={true}
              autocomplete="current-password"
              withRequirements={false}
              errors={getErrorsForField("password", errors)}
            />
          </FormRow>
          <Button type="submit" disabled={isSubmitting}>
            <LockOpenIcon />
            Accéder au rapport sécurisé
          </Button>
        </Form>
      </div>
    </main>
  );
}
