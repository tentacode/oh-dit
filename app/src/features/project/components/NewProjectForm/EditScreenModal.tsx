import Button from "@/src/design-system/components/button/Button";
import Form from "@/src/design-system/components/form/Form";
import Input from "@/src/design-system/components/form/input/Input";
import Label from "@/src/design-system/components/form/Label";
import Modal from "@/src/design-system/components/modal/Modal";
import { getErrorsForField } from "@/src/design-system/utils/form/formErrors";
import { ApiValidationError } from "@/src/lib/react-query/apiClient";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function EditScreenModal({
  open,
  ruleSetType,
  editedScreenName,
  editedScreenUrl,
  onClose,
  onEdit,
}: {
  open: boolean;
  ruleSetType: 'web' | 'mobile' | 'document';
  editedScreenName: string;
  editedScreenUrl: string;
  onClose: () => void;
  onEdit: (newValue: { name: string; url: string }) => void;
}) {
  const [screenName, setScreenName] = useState<string>(editedScreenName);
  const [screenUrl, setScreenUrl] = useState<string>(editedScreenUrl);
  const [errors, setErrors] = useState<ApiValidationError[]>([]);

  const t = useTranslations();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open) {
      setScreenName(editedScreenName);
      setScreenUrl(editedScreenUrl);
      setErrors([]);
    }
  }, [open, editedScreenName, editedScreenUrl]);

  const onSubmitScreen = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const newErrors: ApiValidationError[] = [];

    console.log("Submitting new screen", { screenName, screenUrl });

    if (screenName.trim() === "") {
      console.log("Validation error: screen name is required");
      setErrors([
        ...newErrors,
        {
          propertyPath: "screen-name",
          message: `Le nom ${t(`ruleSet.${ruleSetType}.ofTheScreen`)} est requis.`,
          code: "REQUIRED",
        },
      ]);

      document.getElementById("screen-name")?.focus();

      return;
    }

    setErrors([]);

    const newScreen = {
      name: screenName,
      url: screenUrl,
    };

    onEdit(newScreen);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Form ref={formRef} onSubmit={onSubmitScreen}>
        <h2 className="h3 pr-10">{`${t(`ruleSet.${ruleSetType}.editTheScreen`)} "${editedScreenName}"`}</h2>

        <Label htmlFor="screen-name" required={true}>
          {`Nom ${t(`ruleSet.${ruleSetType}.ofTheScreen`)}`}
        </Label>
        <Input
          value={screenName}
          required={true}
          onChange={(value) => {
            setScreenName(value);
            setErrors([]);
          }}
          name="screen-name"
          errors={getErrorsForField("screen-name", errors)}
        />

        <Label htmlFor="screen-url">{`Url ${t(`ruleSet.${ruleSetType}.ofTheScreen`)}`}</Label>
        <Input
          value={screenUrl}
          required={false}
          onChange={(value) => {
            setScreenUrl(value);
            setErrors([]);
          }}
          name="screen-url"
          errors={getErrorsForField("screen-url", errors)}
        />

        <Button type="submit">
          <DocumentPlusIcon />
          {t(`ruleSet.${ruleSetType}.editTheScreen`)}
        </Button>
      </Form>
    </Modal>
  );
}
