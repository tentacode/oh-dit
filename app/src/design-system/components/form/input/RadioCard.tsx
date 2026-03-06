import radioStyles from "@/src/design-system/styles/form/radio.module.css";

export default function RadioCard({
  name,
  value,
  defaultChecked,
  disabled = false,
  onChange,
  children,
}: {
  name: string;
  value: string;
  defaultChecked: boolean;
  disabled?: boolean;
  onChange: (newValue: string) => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <input
        type="radio"
        id={`${name}-${value}`}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className={`${radioStyles.radioCardInput} ${disabled ? radioStyles.radioCardInputDisabled : ""}`}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <label htmlFor={`${name}-${value}`}>{children}</label>
    </>
  );
}
