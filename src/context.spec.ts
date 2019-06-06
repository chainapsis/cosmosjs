import assert from "assert";
// tslint:disable-next-line:no-implicit-dependencies
import "mocha";
import Context from "./context";

describe("Test context", () => {
  it("context should be immutable", () => {
    const context = new Context({
      chainId: "chain1"
    });

    const newContext = context.set("chainId", "chain2");
    assert.equal(context.get("chainId"), "chain1");
    assert.equal(newContext.get("chainId"), "chain2");
    assert.notEqual(context, newContext);
  });
});
