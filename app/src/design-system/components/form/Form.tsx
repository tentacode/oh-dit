import formStyles from "@/src/design-system/styles/form/form.module.css";

export default function Form({
  children,
  ref,
  onSubmit,
}: {
  children: React.ReactNode;
  ref?: React.Ref<HTMLFormElement>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form ref={ref} noValidate className={formStyles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
