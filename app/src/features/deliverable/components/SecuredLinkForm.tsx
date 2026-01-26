import Button from "@/src/design-system/components/button/Button";
import Form from "@/src/design-system/components/form/Form";
import FormRow from "@/src/design-system/components/form/FormRow";
import Label from "@/src/design-system/components/form/Label";
import PasswordInput from "@/src/design-system/components/form/input/PasswordInput";
import { ExclamationCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useSetSecuredLink } from "../mutations/useSetSecuredLink";
import { useAuditStore } from "../../audit/store/auditStore";
import typographyStyles from "@/src/design-system/styles/typography.module.css";

export default function SecuredLinkForm({
  successfullyDeleted,
  setSuccessfullyDeleted,
}: {
  successfullyDeleted: boolean;
  setSuccessfullyDeleted: (value: boolean) => void;
}) {
  const headerRef = useRef<HTMLHeadingElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const project = useAuditStore((state) => state.project);

  const setSecuredLink = useSetSecuredLink(project?.uuid);

  const [passwordValue, setPasswordValue] = useState("");

  useEffect(() => {
    if (successfullyDeleted) {
      headerRef.current?.focus();

      setSuccessfullyDeleted(false);
    }
  }, [successfullyDeleted, setSuccessfullyDeleted]);

  if (!project) {
    return null;
  }

  const onPasswordChange = (newPassword: string) => {
    setPasswordValue(newPassword);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await setSecuredLink.mutateAsync({
        projectUuid: project.uuid,
        password: passwordValue,
      });
    } catch (error) {
      throw error; // @TODO handle error properly
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 ref={headerRef} className="h2 mb-5" tabIndex={-1}>
        Créer un lien sécurisé
      </h2>
      <p>
        Le rapport présente le taux de conformité, le détail par page ainsi que
        toutes les recommandations que vous avez saisies. Les discussions et les
        commentaires sur les recommandations sont internes et ne seront pas
        visibles dans le rapport.
      </p>
      <p className={typographyStyles.info}>
        <ExclamationCircleIcon />
        Pensez à conserver votre mot de passe, il est stocké de manière
        sécurisée et nous ne serons pas en mesure de vous le restituer.
      </p>
      <Form onSubmit={onSubmit}>
        <FormRow>
          <Label htmlFor="password" required={true}>
            Mot de passe
          </Label>
          <PasswordInput
            name="password"
            value={passwordValue}
            required={true}
            autocomplete="new-password"
            onChange={onPasswordChange}
            withRequirements={true}
          />
        </FormRow>
        <Button type="submit" disabled={isLoading}>
          <PlusIcon />
          Créer le lien sécurisé
        </Button>
      </Form>
    </>
  );
}
