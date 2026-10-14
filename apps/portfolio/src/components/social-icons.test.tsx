import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GithubIcon, LinkedinIcon } from "./social-icons";

describe("SocialIcons", () => {
  it("renders github and linkedin svg icons", () => {
    const { container: ghContainer } = render(<GithubIcon />);
    expect(ghContainer.querySelector("svg")).toBeInTheDocument();

    const { container: liContainer } = render(<LinkedinIcon />);
    expect(liContainer.querySelector("svg")).toBeInTheDocument();
  });
});
