import { useEffect, useRef } from "react";

import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isBusy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Удалить товар",
  isBusy = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      dialog.showModal();

      requestAnimationFrame(() => {
        cancelButtonRef.current?.focus();
      });

      return;
    }

    if (!isOpen && dialog.open) {
      dialog.close();

      requestAnimationFrame(() => {
        previousFocusRef.current?.focus();
      });
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      const dialog = dialogRef.current;

      if (dialog?.open) {
        dialog.close();
      }

      previousFocusRef.current?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      onCancel={(event) => {
        event.preventDefault();

        if (!isBusy) {
          onClose();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !isBusy) {
          onClose();
        }
      }}
    >
      <div className="confirm-dialog__content">
        <span className="confirm-dialog__mark" aria-hidden="true">
          !
        </span>

        <div className="confirm-dialog__copy">
          <h2 id="confirm-dialog-title">{title}</h2>

          <p id="confirm-dialog-description">{description}</p>
        </div>

        <div className="confirm-dialog__actions">
          <Button
            ref={cancelButtonRef}
            variant="secondary"
            disabled={isBusy}
            onClick={onClose}
          >
            Отмена
          </Button>

          <Button variant="danger" disabled={isBusy} onClick={onConfirm}>
            {isBusy ? "Удаление..." : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
