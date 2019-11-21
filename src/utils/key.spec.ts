import assert from "assert";
import "mocha";
import * as Key from "./key";

import crypto from "crypto";

describe("Test wallet", () => {
  it("generate key and mnemonic", () => {
    const { privKey, mnemonic } = Key.generateWallet(
      (array: any): any => {
        return crypto.randomBytes(array.length);
      }
    );
    assert.strictEqual(
      mnemonic.split(" ").length,
      24,
      "should generate 24 words by default"
    );

    const recoveredPrivKey = Key.generateWalletFromMnemonic(mnemonic);
    assert.strictEqual(recoveredPrivKey.toString(), privKey.toString());
    assert.strictEqual(
      recoveredPrivKey.toPubKey().toString(),
      privKey.toPubKey().toString()
    );
    assert.strictEqual(
      recoveredPrivKey
        .toPubKey()
        .toAddress()
        .toBech32("cosmos"),
      privKey
        .toPubKey()
        .toAddress()
        .toBech32("cosmos")
    );
  });

  it("recover key from mnemonic", () => {
    const privKey = Key.generateWalletFromMnemonic(
      "anger river nuclear pig enlist fish demand dress library obtain concert nasty wolf episode ring bargain rely off vibrant iron cram witness extra enforce",
      "m/44'/118'/0'/0/0"
    );

    assert.strictEqual(
      privKey
        .toPubKey()
        .toAddress()
        .toBech32("cosmos"),
      "cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"
    );
  });
});
