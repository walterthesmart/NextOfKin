import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("Main Contract Tests", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should have main contract deployed", () => {
    const { result } = simnet.callReadOnlyFn("storage", "max-recipients", [], deployer);
    expect(result).toBeUint(10);
  });
});
