import switchStyles from "@/src/design-system/styles/button/switch.module.css";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Switch({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button className={switchStyles.switch} role="switch" aria-checked={checked} onClick={onToggle}>
      {label}
      <div className={switchStyles.thumbContainer}>
        <div
          className={switchStyles.thumb}
        >
            <div className={switchStyles.checkIcon}><CheckIcon color="white" /></div>
            <div className={switchStyles.crossIcon}><XMarkIcon color="white" /></div>
        </div>
      </div>
    </button>
  );
}
