import assert from "assert";
// tslint:disable-next-line:no-implicit-dependencies
import "mocha";
import { Buffer } from "buffer/";
import { Coin } from "./coin";
import { Int } from "./int";
import { StdSignDoc, StdFee, registerCodec } from "./stdTx";
import { Msg } from "../core/tx";
import { AccAddress, useBech32Config } from "../common/address";
import { defaultBech32Config } from "../core/bech32Config";
import { Amino } from "@node-a-team/ts-amino";
const { Field, Concrete, DefineStruct } = Amino;

@Concrete("test/MsgTest")
@DefineStruct()
class MsgTest extends Msg {
  @Field.Defined()
  public address: AccAddress;

  constructor(address: Uint8Array) {
    super();
    this.address = new AccAddress(address);
  }
}

describe("Test std tx", () => {
  registerCodec(Amino.globalCodec);

  it("std sign doc should generate corrent sign doc", () => {
    useBech32Config(defaultBech32Config("cosmos"), () => {
      const signDoc = new StdSignDoc(
        Amino.globalCodec,
        1,
        "test",
        new StdFee([new Coin("test", new Int(10))], 1000),
        "test",
        [
          new MsgTest(
            Buffer.from("5e8f356453a096748ef5966fbe26d65079db30a8", "hex")
          )
        ],
        10
      );

      assert.equal(
        signDoc.getSignBytes().toString(),
        `{"account_number":"1","chain_id":"test","fee":{"amount":[{"amount":"10","denom":"test"}],"gas":"1000"},"memo":"test","msgs":[{"type":"test/MsgTest","value":{"address":"cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"}}],"sequence":"10"}`
      );
    });
  });
});
