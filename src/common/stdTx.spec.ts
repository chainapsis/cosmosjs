import assert from "assert";
// tslint:disable-next-line:no-implicit-dependencies
import "mocha";
import { Coin } from "./coin";
import { Int } from "./int";
import { StdSignDoc, StdFee } from "./stdTx";

describe("Test std tx", () => {
  it("std sign doc should generate corrent sign doc", () => {
    const signDoc = new StdSignDoc(
      1,
      "test",
      new StdFee([new Coin("test", new Int(10))], 1000),
      "test",
      [],
      10
    );

    assert.equal(
      signDoc.getSignBytes().toString(),
      `{"account_number":"1","chain_id":"test","fee":{"amount":[{"amount":"10","denom":"test"}],"gas":"1000"},"memo":"test","msgs":null,"sequence":"10"}`
    );
  });
});
