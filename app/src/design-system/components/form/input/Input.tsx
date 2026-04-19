import inputStyles from "@/src/design-system/styles/form/input.module.css";
import { ApiValidationError } from "@/src/lib/react-query/apiClient";
import { clsx } from "clsx";

export default function Input({
  ref,
  name,
  value,
  type = "text",
  autocomplete,
  onChange,
  required,
  errors = [],
}: {
  ref?: React.Ref<HTMLInputElement>;
  name: string;
  value: string;
  type?: 'text' | 'email';
  autocomplete?: 'email' | 'username' | 'current-password' | 'new-password';
  onChange?: (newValue: string) => void;
  required: boolean;
  errors?: ApiValidationError[];
}) {
    const hasErrors = errors.length > 0;

  return (
    <>
      <input
        ref={ref}
        id={name}
        name={name}
        value={value}
        autoComplete={autocomplete}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (typeof onChange === "function") {
            onChange(e.target.value);
          }
        }}
        type={type}
        className={clsx(inputStyles.input, hasErrors && inputStyles.inputError)}
        required={required}
        aria-invalid={hasErrors}
        aria-describedby={`${name}-requirements ${hasErrors ? name + "-errors" : ""}`}
      />
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
