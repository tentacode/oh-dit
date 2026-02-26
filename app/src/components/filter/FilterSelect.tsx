import { ChevronDownIcon } from "@heroicons/react/24/outline";
import styles from "./styles/filters.module.css";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

export default function FilterSelect({
  id,
  selectedValue,
  values,
  children,
  listHeader,
  onChange,
}: {
  id: string;
  selectedValue?: string;
  values: string[];
  listHeader?: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedValue, setFocusedValue] = useState<string | undefined>(
    selectedValue,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const currentIndex = focusedValue ? values.indexOf(focusedValue) : -1;
      let nextIndex: number;

      if (e.key === "ArrowDown") {
        nextIndex =
          currentIndex < values.length - 1 ? currentIndex + 1 : currentIndex;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      }

      setFocusedValue(values[nextIndex]);
    }

    if (e.key === "Enter" || e.key === " ") {
      if (focusedValue) {
        e.preventDefault();
        handleSelect(focusedValue);
      }
      return;
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const focusedId = focusedValue ? `${id}-option-${focusedValue}` : undefined;

  return (
    <div
      ref={containerRef}
      className={styles.filterSelectContainer}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <button
        className={styles.filterSelectButton}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-select-options`}
        onClick={() => setIsOpen((open) => !open)}
      >
        {children}
        <ChevronDownIcon className={styles.filterSelectChevronIcon} />
      </button>
      <div
        id={`${id}-select-options`}
        className={styles.filterSelectOptions}
        role="listbox"
        aria-label="Grouper par"
        aria-activedescendant={focusedId}
        tabIndex={-1}
        hidden={!isOpen}
      >
        {listHeader && <div role="presentation">{listHeader}</div>}
        {values.map((optionValue, index) => (
          <div
            key={optionValue}
            id={`${id}-option-${optionValue}`}
            tabIndex={index === 0 ? 0 : -1}
            role="option"
            aria-selected={optionValue === selectedValue}
            className={clsx(styles.filterSelectOption, {
              [styles.filterSelectOptionFocused]: optionValue === focusedValue,
            })}
            onMouseEnter={() => setFocusedValue(optionValue)}
            onFocus={() => setFocusedValue(optionValue)}
            onClick={() => handleSelect(optionValue)}
          >
            {optionValue}
          </div>
        ))}
      </div>
    </div>
  );
}
