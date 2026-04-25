import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ConfirmActionDialog } from "./confirm-action-dialog";

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  title: "Cancel Policy",
  description:
    "This action cannot be undone. Your policy will be permanently cancelled.",
};

describe("ConfirmActionDialog", () => {
  it("renders title and description when open", () => {
    render(<ConfirmActionDialog {...defaultProps} />);
    expect(screen.getByText("Cancel Policy")).toBeInTheDocument();
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<ConfirmActionDialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", () => {
    const onClose = vi.fn();
    render(<ConfirmActionDialog {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(<ConfirmActionDialog {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce());
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<ConfirmActionDialog {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not close on Escape when loading", () => {
    const onClose = vi.fn();
    render(
      <ConfirmActionDialog {...defaultProps} onClose={onClose} isLoading />,
    );
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("disables buttons when isLoading is true", () => {
    render(<ConfirmActionDialog {...defaultProps} isLoading />);
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /confirm/i })).toBeDisabled();
  });

  it("renders custom confirm and cancel labels", () => {
    render(
      <ConfirmActionDialog
        {...defaultProps}
        confirmLabel="Yes, cancel policy"
        cancelLabel="Keep policy"
      />,
    );
    expect(
      screen.getByRole("button", { name: /yes, cancel policy/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /keep policy/i }),
    ).toBeInTheDocument();
  });

  it("has accessible dialog role and aria attributes", () => {
    render(<ConfirmActionDialog {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");
  });

  it("renders danger variant", () => {
    const { container } = render(
      <ConfirmActionDialog
        {...defaultProps}
        variant="danger"
        confirmLabel="Delete"
      />,
    );
    expect(container.querySelector(".ob-btn--danger")).toBeInTheDocument();
  });

  it("closes when backdrop is clicked", () => {
    const onClose = vi.fn();
    render(<ConfirmActionDialog {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
