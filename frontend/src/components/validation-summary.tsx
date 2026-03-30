"use client";

import React from "react";
import { Icon } from "@/components/icon";

export interface ValidationError {
  id: string;
  field: string;
  message: string;
}

interface ValidationSummaryProps {
  errors: ValidationError[];
}

export function ValidationSummary({ errors }: ValidationSummaryProps) {
  if (errors.length === 0) return null;

  const scrollToField = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
    }
  };

  return (
    <div className="validation-summary motion-panel" role="alert" aria-labelledby="validation-summary-title">
      <div className="validation-summary__header">
        <Icon name="alert" size="md" tone="warning" />
        <h3 id="validation-summary-title">Resolve following errors to continue</h3>
      </div>

      <ul className="validation-summary__list">
        {errors.map((error, index) => (
          <li key={index} className="validation-summary__item">
            <button
              className="validation-summary__link"
              type="button"
              onClick={() => scrollToField(error.id)}
            >
              <span>{error.field}:</span> {error.message}
            </button>
          </li>
        ))}
      </ul>

      <p className="validation-summary__hint">
        Click on any error above to jump to the corresponding input field.
      </p>
    </div>
  );
}
