import assert from "assert";
import "mocha";
import { ImmutableContext } from "./context";

describe("Test context", () => {
  it("context should be immutable", () => {
    const context = new ImmutableContext({
      test: "test1"
    });

    const newContext = context.set("test", "test2");
    assert.equal(context.get("test"), "test1");
    assert.equal(newContext.get("test"), "test2");
    assert.notEqual(context, newContext);
  });
});
