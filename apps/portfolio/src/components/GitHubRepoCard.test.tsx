import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GitHubRepoCard from "./GitHubRepoCard";
import type { GitHubRepo } from "../data/types";

describe("GitHubRepoCard", () => {
  const mockRepo: GitHubRepo = {
    id: 12345,
    name: "mono-repo",
    description: "Monorepo for apps",
    html_url: "https://github.com/kamachi-dev/mono",
    homepage: "https://machi.asia",
    language: "TypeScript",
    stargazers_count: 42,
    forks_count: 5,
    watchers_count: 42,
    topics: ["nextjs", "typescript", "monorepo"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    pushed_at: "2024-01-02T00:00:00Z",
  };

  it("renders repo details and topics", () => {
    render(<GitHubRepoCard repo={mockRepo} />);
    expect(screen.getByText("mono-repo")).toBeInTheDocument();
    expect(screen.getByText("Monorepo for apps")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("shows and hides the styled hover popup with dates and live demo link", () => {
    const { container } = render(<GitHubRepoCard repo={mockRepo} />);
    const wrapper = container.querySelector(".repo-card-wrapper");
    expect(wrapper).not.toBeNull();

    expect(screen.queryByTestId("repo-hover-card")).not.toBeInTheDocument();

    fireEvent.mouseEnter(wrapper!);
    const popup = screen.getByTestId("repo-hover-card");
    expect(popup).toHaveClass("hover-card-content");
    expect(popup).toHaveTextContent(/Created:/);
    expect(popup).toHaveTextContent(/Updated:/);
    expect(screen.getByRole("link", { name: /Live Demo/i })).toHaveAttribute(
      "href",
      "https://machi.asia"
    );

    fireEvent.mouseLeave(wrapper!);
    expect(screen.queryByTestId("repo-hover-card")).not.toBeInTheDocument();
  });
});
