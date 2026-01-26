import formStyles from "@/src/design-system/styles/form/form.module.css";

export default function Form({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form noValidate className={formStyles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
