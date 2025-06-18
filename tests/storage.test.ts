
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("Storage Contract Tests", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should return correct max recipients", () => {
    const { result } = simnet.callReadOnlyFn("storage", "max-recipients", [], deployer);
    expect(result).toBeUint(10);
  });

  it("should return correct inactivity period", () => {
    const { result } = simnet.callReadOnlyFn("storage", "inactivity-period", [], deployer);
    expect(result).toBeUint(52560);
  });


});
