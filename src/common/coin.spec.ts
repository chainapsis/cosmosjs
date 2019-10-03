import assert from "assert";
import "mocha";
import { Coin } from "./coin";

describe("Test coin", () => {
  it("coin parsed from str properly", () => {
    let coin = Coin.parse("1000test");

    assert.equal(coin.denom, "test");
    assert.equal(coin.amount.toString(), "1000");

    coin = Coin.parse("1000tesT");

    assert.equal(coin.denom, "tesT");
    assert.equal(coin.amount.toString(), "1000");

    coin = Coin.parse("1000TEST");

    assert.equal(coin.denom, "TEST");
    assert.equal(coin.amount.toString(), "1000");
  });
});
