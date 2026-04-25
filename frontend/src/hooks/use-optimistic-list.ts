"use client";

import { useCallback, useState } from "react";

export type OptimisticStatus = "confirmed" | "pending" | "error";

export interface OptimisticItem<T> {
  data: T;
  optimisticStatus: OptimisticStatus;
  optimisticId?: string;
}

/**
 * Manages a list with optimistic additions.
 * Items added optimistically appear immediately with status "pending",
 * then transition to "confirmed" or "error" once the real operation resolves.
 */
export function useOptimisticList<T extends { id: string }>(initialItems: T[]) {
  const [items, setItems] = useState<OptimisticItem<T>[]>(
    initialItems.map((item) => ({ data: item, optimisticStatus: "confirmed" })),
  );

  /** Optimistically prepend an item. Returns the optimistic ID. */
  const addOptimistic = useCallback((item: T): string => {
    const optimisticId = item.id;
    setItems((prev) => [
      { data: item, optimisticStatus: "pending", optimisticId },
      ...prev,
    ]);
    return optimisticId;
  }, []);

  /** Confirm an optimistic item (replace with real data). */
  const confirmItem = useCallback((optimisticId: string, confirmedItem: T) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.optimisticId === optimisticId
          ? { data: confirmedItem, optimisticStatus: "confirmed" }
          : entry,
      ),
    );
  }, []);

  /** Mark an optimistic item as errored. */
  const rejectItem = useCallback((optimisticId: string) => {
    setItems((prev) =>
      prev.map((entry) =>
        entry.optimisticId === optimisticId
          ? { ...entry, optimisticStatus: "error" }
          : entry,
      ),
    );
  }, []);

  /** Remove an item (e.g. after dismissing an error). */
  const removeItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.filter((entry) => entry.data.id !== id && entry.optimisticId !== id),
    );
  }, []);

  return { items, addOptimistic, confirmItem, rejectItem, removeItem };
}
