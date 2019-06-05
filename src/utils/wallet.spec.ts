import assert from "assert";
// tslint:disable-next-line:no-implicit-dependencies
import "mocha";
import * as Wallet from "./wallet";

import crypto from "crypto";

describe("Test wallet", () => {
  it("generate key and mnemonic", () => {
    const { wallet, mnemonic } = Wallet.generateWallet(
      (array: any): any => {
        return crypto.randomBytes(array.length);
      }
    );
    assert.equal(
      mnemonic.split(" ").length,
      24,
      "should generate 24 words by default"
    );

    const recovered = Wallet.generateWalletFromMnemonic(mnemonic);
    assert.equal(recovered.privKey.toString(), wallet.privKey.toString());
    assert.equal(recovered.pubKey.toString(), wallet.pubKey.toString());
    assert.equal(
      recovered.pubKey.toAddress().toBech32("cosmos"),
      wallet.pubKey.toAddress().toBech32("cosmos")
    );
  });

  it("recover key from mnemonic", () => {
    const wallet = Wallet.generateWalletFromMnemonic(
      "anger river nuclear pig enlist fish demand dress library obtain concert nasty wolf episode ring bargain rely off vibrant iron cram witness extra enforce",
      "m/44'/118'/0'/0/0"
    );

    assert.equal(
      wallet.pubKey.toAddress().toBech32("cosmos"),
      "cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"
    );
  });
});
