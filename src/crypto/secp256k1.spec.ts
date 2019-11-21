import assert from "assert";
import "mocha";
import { PrivKeySecp256k1 } from "./secp256k1";
import { Buffer } from "buffer/";
import { Amino } from "@node-a-team/ts-amino";
import { registerCodec } from "./codec";

describe("Test secp256k1", () => {
  registerCodec(Amino.globalCodec);

  it("secp256k1 should generate correct signature", () => {
    const privKey = new PrivKeySecp256k1(
      new Uint8Array([
        110,
        52,
        11,
        156,
        255,
        179,
        122,
        152,
        156,
        165,
        68,
        230,
        187,
        120,
        10,
        44,
        120,
        144,
        29,
        63,
        179,
        55,
        56,
        118,
        133,
        17,
        163,
        6,
        23,
        175,
        160,
        30
      ])
    );
    const pubKey = privKey.toPubKey();
    assert.strictEqual(
      Buffer.from(pubKey.toBytes()).toString("hex"),
      "eb5ae98721037241cbb79688a20d01ed093ebb06c6fd0341be948090ba0fda36a5efa742fe3d"
    );

    const signature = privKey.sign(new Uint8Array([1, 2, 3]));
    assert.strictEqual(
      Buffer.from(signature).toString("hex"),
      "07fd207549d1d550d567b7951897b19daa8fe01dc34baa90cb741742583b090b0af162b3fddd83a2dd5981bfd66243bcba7d64f8f1ce3bc6855b086edc65378a"
    );
  });
});
