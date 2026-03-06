"use client";

import { createPortal } from "react-dom";

import modalStyles from "@/src/design-system/styles/modal/modal.module.css";
import { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();

      document.body.style.overflow = "hidden";

      closeButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();

      document.body.style.overflow = "";
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
    // if (e.clientX === 0 && e.clientY === 0) return; // click clavier simulé

    // const rect = dialogRef.current?.getBoundingClientRect();
    // if (!rect) return;

    // const isInsideDialog =
    //   e.clientX >= rect.left &&
    //   e.clientX <= rect.right &&
    //   e.clientY >= rect.top &&
    //   e.clientY <= rect.bottom;

    // if (!isInsideDialog) {
    //   console.log("Backdrop clicked, closing modal");
    //   onClose();
    // }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={modalStyles.modal}
      onClick={handleBackdropClick}
    >
      <button
        className={modalStyles.closeButton}
        type="button"
        aria-label="Fermer la boîte de dialogue"
        ref={closeButtonRef}
        onClick={onClose}
      >
        <XMarkIcon />
      </button>

      {children}
    </dialog>,
    document.body,
  );
}
