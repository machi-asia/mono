import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  PRIVACY_DISCLOSURES_REGISTRY,
  registerPrivacyDisclosure,
  listPrivacyDisclosures,
  getPrivacyConsent,
  setPrivacyConsent,
  usePrivacyConsent,
} from "../privacy-registry";

function ConsentToggleDemo({ controlKey }: { controlKey: string }) {
  const [enabled, setEnabled] = usePrivacyConsent(controlKey, true);
  return (
    <div>
      <span data-testid="consent-state">{String(enabled)}</span>
      <button type="button" onClick={() => setEnabled(!enabled)}>
        Toggle
      </button>
    </div>
  );
}

describe("privacy-registry and usePrivacyConsent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("registers custom privacy disclosures dynamically", () => {
    expect(listPrivacyDisclosures().length).toBeGreaterThanOrEqual(7);

    registerPrivacyDisclosure({
      appKey: "itemlist-create",
      appName: "Create Mod Calculator",
      appPath: "apps/itemlist-create",
      description: "Stores kinetic factory layouts locally.",
      dataCollected: ["Kinetic stress target preferences"],
      purpose: "Restoring calculator tabs across sessions.",
      requirement: "optional",
      controlType: "toggle",
      controlKey: "create_mod_autosave",
      controlLabel: "Enable automatic blueprint local caching",
    });

    expect(PRIVACY_DISCLOSURES_REGISTRY.has("itemlist-create")).toBe(true);
    expect(getPrivacyConsent("create_mod_autosave", true)).toBe(true);

    setPrivacyConsent("create_mod_autosave", false);
    expect(getPrivacyConsent("create_mod_autosave", true)).toBe(false);
  });

  it("reactively updates usePrivacyConsent across components", () => {
    render(<ConsentToggleDemo controlKey="telemetry_enabled" />);
    expect(screen.getByTestId("consent-state").textContent).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.getByTestId("consent-state").textContent).toBe("false");
    expect(window.localStorage.getItem("machi_telemetry_optin")).toBe("false");
  });
});
