import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React, { useRef } from "react";
import TabIndicator from "./TabIndicator";

function TestWrapper() {
  const listRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={listRef}>
      <button data-state="active">Tab 1</button>
      <button data-state="inactive">Tab 2</button>
      <TabIndicator listRef={listRef} />
    </div>
  );
}

describe("TabIndicator", () => {
  it("renders indicator element inside tab list", () => {
    const { container } = render(<TestWrapper />);
    expect(container.querySelector(".tabs-indicator")).toBeInTheDocument();
  });
});
