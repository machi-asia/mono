import { describe, expect, it } from "vitest";
import {
  handleUowemeCheckout,
  handleUowemeCreateDebt,
  handleUowemeDeleteDebt,
  handleUowemeGetDebts,
  handleUowemeGetUsers,
  handleUowemeUpdateDebt,
} from "./handlers";

describe("UOweMe API handlers", () => {
  it("returns guest defaults for debts and users when unauthenticated", async () => {
    const debtsRes = await handleUowemeGetDebts();
    expect(debtsRes.status).toBe(200);
    expect(await debtsRes.json()).toEqual({ debts: [], isGuest: true });

    const usersRes = await handleUowemeGetUsers(new Request("http://localhost:3005/uoweme/users?q=al"));
    expect(usersRes.status).toBe(200);
    expect(await usersRes.json()).toEqual({ contacts: [] });
  });

  it("rejects unauthenticated mutations with 401", async () => {
    const createRes = await handleUowemeCreateDebt(
      new Request("http://localhost:3005/uoweme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person: "Alyssa", amount: 100 }),
      })
    );
    expect(createRes.status).toBe(401);

    const patchRes = await handleUowemeUpdateDebt(
      new Request("http://localhost:3005/uoweme/123", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settled: true }),
      }),
      "123"
    );
    expect(patchRes.status).toBe(401);

    const delRes = await handleUowemeDeleteDebt(
      new Request("http://localhost:3005/uoweme/123", { method: "DELETE" }),
      "123"
    );
    expect(delRes.status).toBe(401);

    const checkoutRes = await handleUowemeCheckout(
      new Request("http://localhost:3005/uoweme/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person: "Alyssa" }),
      })
    );
    expect(checkoutRes.status).toBe(401);
  });
});
