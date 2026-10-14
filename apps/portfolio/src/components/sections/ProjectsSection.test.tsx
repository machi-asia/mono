import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProjectsSection from "./ProjectsSection";
import type { GitHubRepo } from "../../data/types";

describe("ProjectsSection", () => {
  const mockRepos: GitHubRepo[] = [
    {
      id: 1,
      name: "awesome-project",
      description: "A super project",
      html_url: "https://github.com/kamachi-dev/awesome-project",
      homepage: null,
      language: "TypeScript",
      stargazers_count: 10,
      forks_count: 2,
      watchers_count: 10,
      topics: ["typescript"],
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
      pushed_at: "2024-01-02T00:00:00Z",
    },
  ];

  it("renders projects section with repos and filters", () => {
    render(
      <ProjectsSection
        repos={mockRepos}
        reposLoading={false}
        reposError={null}
      />
    );
    expect(screen.getByRole("heading", { name: /My GitHub Repos/i })).toBeInTheDocument();
    expect(screen.getByText("awesome-project")).toBeInTheDocument();
  });
});
