import assert from "assert";
import "mocha";
import { sortJSON } from "./sortJson";

describe("Test std tx", () => {
  it("test json is sorted by alphabetically", () => {
    const obj = {
      b: {
        b: "b",
        a: "a",
        c: "c"
      },
      a: {
        e: ["a", "b"],
        f: {
          c: "c",
          b: "b"
        }
      }
    };

    assert.strictEqual(
      sortJSON(JSON.stringify(obj)),
      `{"a":{"e":["a","b"],"f":{"b":"b","c":"c"}},"b":{"a":"a","b":"b","c":"c"}}`
    );
  });
});
