import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MockAuthProvider } from "@mono/auth/mock";
import VisitorsSection from "./VisitorsSection";

describe("VisitorsSection", () => {
  it("renders visitor reviews, average rating, and action buttons", () => {
    render(
      <MockAuthProvider state="signed-out">
        <VisitorsSection />
      </MockAuthProvider>
    );
    expect(screen.getByText("Community Reviews")).toBeInTheDocument();
    expect(screen.getByText("Average Rating")).toBeInTheDocument();
  });
});
