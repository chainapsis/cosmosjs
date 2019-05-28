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
    assert.equal(mnemonic.split(" ").length, 24);

    const recovered = Wallet.generateWalletFromMnemonic(mnemonic);
    assert.equal(recovered.privateKey.toString(), wallet.privateKey.toString());
    assert.equal(recovered.publicKey.toString(), wallet.publicKey.toString());
    assert.equal(
      Wallet.publicToBech32Address(recovered.publicKey, "cosmos"),
      Wallet.publicToBech32Address(wallet.publicKey, "cosmos")
    );
  });

  it("recover key from mnemonic", () => {
    const wallet = Wallet.generateWalletFromMnemonic(
      "anger river nuclear pig enlist fish demand dress library obtain concert nasty wolf episode ring bargain rely off vibrant iron cram witness extra enforce",
      "m/44'/118'/0'/0/0"
    );

    assert.equal(
      Wallet.publicToBech32Address(wallet.publicKey, "cosmos"),
      "cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"
    );
  });
});
