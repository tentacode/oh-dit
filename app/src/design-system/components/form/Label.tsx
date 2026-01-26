import labelStyles from "@/src/design-system/styles/form/label.module.css";

export default function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required: boolean;
  children: string;
}) {
  return (
    <label className={labelStyles.label} htmlFor={htmlFor}>
      {children}
      {required && <span className={labelStyles.requiredStar} aria-hidden="true">*</span>} :
    </label>
  );
}
