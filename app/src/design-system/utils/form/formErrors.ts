import { ApiValidationError } from "@/src/lib/react-query/apiClient";

export function getErrorsForField(
  fieldName: string,
  errors: ApiValidationError[]
): ApiValidationError[] {
  return errors.filter((error) => error.propertyPath === fieldName);
}

export function hasFieldError(
  fieldName: string,
  errors: ApiValidationError[]
): boolean {
  return getErrorsForField(fieldName, errors).length > 0;
}