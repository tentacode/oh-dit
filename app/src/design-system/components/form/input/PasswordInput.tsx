import inputStyles from "@/src/design-system/styles/form/input.module.css";
import { PasswordAutocomplete } from "@/src/design-system/types/autocomplete";
import { ApiValidationError } from "@/src/lib/react-query/apiClient";
import {
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import { useState } from "react";

export default function PasswordInput({
  ref,
  name,
  value,
  onChange,
  required,
  autocomplete,
  errors = [],
  withRequirements = false,
}: {
  ref?: React.Ref<HTMLInputElement>;
  name: string;
  value: string;
  onChange?: (newPassword: string) => void;
  required: boolean;
  autocomplete: PasswordAutocomplete;
  errors?: ApiValidationError[];
  withRequirements?: boolean;
}) {
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const lengthError = value.length < 12;
  const uppercaseError = !/[A-Z]/.test(value);
  const numberError = !/[0-9]/.test(value);
  const specialCharError = !/[\W]/.test(value);

  let hasErrors =
    lengthError || uppercaseError || numberError || specialCharError || errors.length > 0;

  if (!withRequirements) {
    hasErrors = errors.length > 0;
  }

  return (
    <>
      <div className={inputStyles.passwordInputContainer}>
        <input
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (typeof onChange === "function") {
              onChange(e.target.value);
            }
          }}
          type={isPasswordVisible ? "text" : "password"}
          className={clsx(
            inputStyles.input,
            hasErrors && inputStyles.inputError
          )}
          required={required}
          autoComplete={autocomplete}
          aria-invalid={hasErrors}
          aria-describedby={`${name}-requirements ${hasErrors ? name + "-errors" : ""}`}
        />
        <button
          type="button"
          className={inputStyles.revealPassword}
          aria-pressed={isPasswordVisible}
          aria-label={
            isPasswordVisible
              ? "Masquer le mot de passe"
              : "Afficher le mot de passe"
          }
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? <EyeIcon /> : <EyeSlashIcon />}
        </button>
      </div>
      {withRequirements && (
        <ul
          id={`${name}-requirements`}
          className={inputStyles.inputRequirements}
        >
          <li>
            {lengthError ? (
              <XMarkIcon color="#E2026A" />
            ) : (
              <CheckIcon color="#56C07C" />
            )}
            au moins 12 caractères
          </li>
          <li>
            {uppercaseError ? (
              <XMarkIcon color="#E2026A" />
            ) : (
              <CheckIcon color="#56C07C" />
            )}
            au moins une lettre majuscule
          </li>
          <li>
            {numberError ? (
              <XMarkIcon color="#E2026A" />
            ) : (
              <CheckIcon color="#56C07C" />
            )}
            au moins un chiffre
          </li>
          <li>
            {specialCharError ? (
              <XMarkIcon color="#E2026A" />
            ) : (
              <CheckIcon color="#56C07C" />
            )}
            au moins un caractère spécial (par exemple: !@#$%^&*_ ou espace)
          </li>
        </ul>
      )}
      {errors.length > 0 && (
        <ul id={`${name}-errors`} className={inputStyles.errorsList}>
          {errors.map((error) => (
            <li key={error.message}>{error.message}</li>
          ))}
        </ul>
      )}
    </>
  );
}
