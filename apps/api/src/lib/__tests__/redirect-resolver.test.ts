import { describe, it, expect } from "vitest";
import {
  isAllowedRedirectUrl,
  resolveAppFromUrl,
  constructRelayUrl,
  generateMobileAppUrls,
} from "../redirect-resolver";

describe("redirect-resolver", () => {
  describe("isAllowedRedirectUrl", () => {
    it("allows *.machi.asia subdomains and apex domain", () => {
      expect(isAllowedRedirectUrl("https://machi.asia")).toBe(true);
      expect(isAllowedRedirectUrl("https://calculator.machi.asia/recipes")).toBe(true);
      expect(isAllowedRedirectUrl("https://hellsforge.machi.asia/game")).toBe(true);
      expect(isAllowedRedirectUrl("https://docs.machi.asia/docs/intro")).toBe(true);
      expect(isAllowedRedirectUrl("https://rose.machi.asia")).toBe(true);
    });

    it("allows localhost and 127.0.0.1 on various ports", () => {
      expect(isAllowedRedirectUrl("http://localhost:3000")).toBe(true);
      expect(isAllowedRedirectUrl("http://localhost:3001/calculator")).toBe(true);
      expect(isAllowedRedirectUrl("http://127.0.0.1:3005")).toBe(true);
    });

    it("rejects malicious or disallowed URLs", () => {
      expect(isAllowedRedirectUrl("https://evil.com")).toBe(false);
      expect(isAllowedRedirectUrl("https://machi.asia.evil.com")).toBe(false);
      expect(isAllowedRedirectUrl("javascript:alert(1)")).toBe(false);
      expect(isAllowedRedirectUrl("not-a-url")).toBe(false);
    });
  });

  describe("resolveAppFromUrl", () => {
    it("resolves calculator from hostname or port 3001", () => {
      expect(resolveAppFromUrl("https://calculator.machi.asia").id).toBe("calculator");
      expect(resolveAppFromUrl("http://localhost:3001").id).toBe("calculator");
    });

    it("resolves docs from hostname or port 3002", () => {
      expect(resolveAppFromUrl("https://docs.machi.asia").id).toBe("docs");
      expect(resolveAppFromUrl("http://localhost:3002").id).toBe("docs");
    });

    it("resolves hells-forge from hostname or port 3003", () => {
      expect(resolveAppFromUrl("https://hellsforge.machi.asia").id).toBe("hells-forge");
      expect(resolveAppFromUrl("http://localhost:3003").id).toBe("hells-forge");
    });

    it("resolves rose from hostname or port 3004", () => {
      expect(resolveAppFromUrl("https://rose.machi.asia").id).toBe("rose");
      expect(resolveAppFromUrl("http://localhost:3004").id).toBe("rose");
    });

    it("defaults to portal for main domain or port 3000", () => {
      expect(resolveAppFromUrl("https://machi.asia").id).toBe("portal");
      expect(resolveAppFromUrl("http://localhost:3000").id).toBe("portal");
    });
  });

  describe("constructRelayUrl", () => {
    it("preserves returnTo and relays query parameters and hash fragments", () => {
      const searchParams = new URLSearchParams("returnTo=https%3A%2F%2Fcalculator.machi.asia%2Frecipes&code=auth_code_123");
      const { targetUrl, app } = constructRelayUrl(
        "https://calculator.machi.asia/recipes",
        searchParams,
        "#access_token=token123"
      );

      expect(app.id).toBe("calculator");
      expect(targetUrl).toContain("https://calculator.machi.asia/recipes");
      expect(targetUrl).toContain("code=auth_code_123");
      expect(targetUrl).toContain("#access_token=token123");
      expect(targetUrl).not.toContain("returnTo=");
    });

    it("falls back to machi.asia if returnTo is invalid or empty", () => {
      const searchParams = new URLSearchParams("code=xyz");
      const { targetUrl, app } = constructRelayUrl("https://phishing.com", searchParams);

      expect(app.id).toBe("portal");
      expect(targetUrl).toContain("https://machi.asia");
      expect(targetUrl).toContain("code=xyz");
    });
  });

  describe("generateMobileAppUrls", () => {
    it("constructs custom scheme and Android intent URLs", () => {
      const app = resolveAppFromUrl("https://calculator.machi.asia/recipes");
      const { customSchemeUrl, androidIntentUrl } = generateMobileAppUrls(
        app,
        "https://calculator.machi.asia/recipes?code=123"
      );

      expect(customSchemeUrl).toBe("machicalculator://recipes?code=123");
      expect(androidIntentUrl).toContain("intent://recipes?code=123#Intent;");
      expect(androidIntentUrl).toContain("package=asia.machi.calculator");
      expect(androidIntentUrl).toContain("scheme=machicalculator");
    });
  });
});
