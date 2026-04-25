import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useOptimisticList } from "./use-optimistic-list";

interface Item {
  id: string;
  name: string;
}

const INITIAL: Item[] = [
  { id: "a", name: "Alpha" },
  { id: "b", name: "Beta" },
];

describe("useOptimisticList", () => {
  it("initializes with confirmed items", () => {
    const { result } = renderHook(() => useOptimisticList<Item>(INITIAL));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0].optimisticStatus).toBe("confirmed");
  });

  it("prepends optimistic item with pending status", () => {
    const { result } = renderHook(() => useOptimisticList<Item>(INITIAL));
    act(() => {
      result.current.addOptimistic({ id: "opt-1", name: "Optimistic" });
    });
    expect(result.current.items).toHaveLength(3);
    expect(result.current.items[0].data.name).toBe("Optimistic");
    expect(result.current.items[0].optimisticStatus).toBe("pending");
  });

  it("confirms an optimistic item", () => {
    const { result } = renderHook(() => useOptimisticList<Item>(INITIAL));
    act(() => {
      result.current.addOptimistic({ id: "opt-2", name: "Pending" });
    });
    act(() => {
      result.current.confirmItem("opt-2", { id: "opt-2", name: "Confirmed" });
    });
    const item = result.current.items.find((e) => e.data.id === "opt-2");
    expect(item?.optimisticStatus).toBe("confirmed");
    expect(item?.data.name).toBe("Confirmed");
  });

  it("rejects an optimistic item", () => {
    const { result } = renderHook(() => useOptimisticList<Item>(INITIAL));
    act(() => {
      result.current.addOptimistic({ id: "opt-3", name: "Will fail" });
    });
    act(() => {
      result.current.rejectItem("opt-3");
    });
    const item = result.current.items.find((e) => e.data.id === "opt-3");
    expect(item?.optimisticStatus).toBe("error");
  });

  it("removes an item by id", () => {
    const { result } = renderHook(() => useOptimisticList<Item>(INITIAL));
    act(() => {
      result.current.removeItem("a");
    });
    expect(result.current.items.find((e) => e.data.id === "a")).toBeUndefined();
    expect(result.current.items).toHaveLength(1);
  });
});
