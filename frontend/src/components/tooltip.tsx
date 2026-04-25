"use client";

import React, { useState, useRef, useEffect } from "react";

export interface TooltipProps {
  /** Text content rendered inside the tooltip bubble. */
  content: string;
  /** Preferred placement relative to the trigger. Defaults to "top". */
  placement?: "top" | "bottom" | "left" | "right";
  /** Milliseconds before the tooltip appears on hover. Defaults to 300. */
  showDelay?: number;
  /** Milliseconds before the tooltip hides after pointer leaves. Defaults to 100. */
  hideDelay?: number;
  /** The trigger element. Must be a single focusable React element. */
  children: React.ReactElement;
}

export function Tooltip({
  children,
  showDelay = 300,
  hideDelay = 100,
}: TooltipProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (showTimer.current !== null) clearTimeout(showTimer.current);
      if (hideTimer.current !== null) clearTimeout(hideTimer.current);
    };
  }, []);

  function handleMouseEnter() {
    if (hideTimer.current !== null) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    showTimer.current = setTimeout(() => setOpen(true), showDelay);
  }

  function handleMouseLeave() {
    if (showTimer.current !== null) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    hideTimer.current = setTimeout(() => setOpen(false), hideDelay);
  }

  function handleFocus() {
    if (showTimer.current !== null) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    if (hideTimer.current !== null) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setOpen(true);
  }

  function handleBlur() {
    if (showTimer.current !== null) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    if (hideTimer.current !== null) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setOpen(false);
  }

  // These handlers will be wired to the tooltip bubble element in task 4.1.
  // handleBubbleMouseEnter: cancels the hide timer so the tooltip stays visible
  // when the pointer moves from the trigger onto the bubble.
  function handleBubbleMouseEnter() {
    if (hideTimer.current !== null) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }

  // handleBubbleMouseLeave: restarts the hide timer when the pointer leaves the bubble.
  function handleBubbleMouseLeave() {
    hideTimer.current = setTimeout(() => setOpen(false), hideDelay);
  }

  const trigger = React.cloneElement(children, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
  });

  return trigger;
}
