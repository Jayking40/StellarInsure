"use client";

import React, { useEffect, useRef } from "react";
import { Icon } from "./icon";

export type ConfirmActionVariant = "danger" | "warning" | "default";

export interface ConfirmActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmActionVariant;
  isLoading?: boolean;
}

const VARIANT_CONFIG: Record<
  ConfirmActionVariant,
  {
    iconName: "alert-triangle" | "alert" | "shield";
    tone: "warning" | "danger" | "accent";
  }
> = {
  danger: { iconName: "alert-triangle", tone: "danger" },
  warning: { iconName: "alert", tone: "warning" },
  default: { iconName: "shield", tone: "accent" },
};

export function ConfirmActionDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmActionDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = React.useId();
  const descId = React.useId();

  // Focus cancel button when dialog opens
  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape" && !isLoading) onClose();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && !isLoading) onClose();
  }

  if (!isOpen) return null;

  const { iconName, tone } = VARIANT_CONFIG[variant];

  return (
    <div
      className="ob-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      tabIndex={-1}
    >
      <div className="ob-modal confirm-dialog">
        {!isLoading && (
          <button
            className="ob-skip"
            onClick={onClose}
            aria-label="Close dialog"
          >
            Close
          </button>
        )}

        <div className="ob-content">
          <div className="ob-icon" aria-hidden="true">
            <Icon name={iconName} size="lg" tone={tone} />
          </div>
          <h2 id={titleId} className="ob-title">
            {title}
          </h2>
          <p id={descId} className="ob-desc">
            {description}
          </p>
        </div>

        <div className="ob-nav">
          <button
            ref={cancelRef}
            className="ob-btn ob-btn--ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            className={`ob-btn ${variant === "danger" ? "ob-btn--danger" : "ob-btn--primary"}`}
            onClick={onConfirm}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span className="ob-btn-loading" aria-hidden="true">
                …
              </span>
            ) : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
