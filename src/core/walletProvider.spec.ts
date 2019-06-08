import assert from "assert";
// tslint:disable-next-line:no-implicit-dependencies
import "mocha";
import { LocalWalletProvider } from "./walletProvider";

import crypto from "crypto";

describe("Test local wallet provider", () => {
  it("local wallet provider should generate correct priv key", async () => {
    const localWalletProvider = new LocalWalletProvider(
      "anger river nuclear pig enlist fish demand dress library obtain concert nasty wolf episode ring bargain rely off vibrant iron cram witness extra enforce",
      (array: any): any => {
        return crypto.randomBytes(array.length);
      }
    );

    await localWalletProvider.signIn("m/44'/118'/0'/0/0");

    const accounts = await localWalletProvider.getSignerAccounts();
    assert.equal(accounts.length, 1);

    const account = accounts[0];
    assert.equal(
      account.pubKey.toAddress().toBech32("cosmos"),
      "cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"
    );
  });
});
