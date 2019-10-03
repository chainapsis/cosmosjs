import assert from "assert";
import "mocha";
import { LocalWalletProvider } from "./walletProvider";
import { Address } from "../crypto";

import crypto from "crypto";
import { Context } from "./context";
import { BIP44 } from "./bip44";
import { Codec } from "@node-a-team/ts-amino";

describe("Test local wallet provider", () => {
  it("local wallet provider should generate correct priv key", async () => {
    const localWalletProvider = new LocalWalletProvider(
      "anger river nuclear pig enlist fish demand dress library obtain concert nasty wolf episode ring bargain rely off vibrant iron cram witness extra enforce",
      (array: any): any => {
        return crypto.randomBytes(array.length);
      }
    );

    const context: Context = new Context({
      chainId: "",
      txEncoder: undefined as any,
      txBuilder: undefined as any,
      bech32Config: undefined as any,
      walletProvider: undefined as any,
      rpcInstance: undefined as any,
      restInstance: undefined as any,
      queryAccount: undefined as any,
      bip44: new BIP44(44, 118, 0),
      codec: new Codec()
    });

    await localWalletProvider.signIn(context, 0);

    const accounts = await localWalletProvider.getSignerAccounts(context);
    assert.equal(accounts.length, 1);

    const account = accounts[0];
    assert.equal(
      account.pubKey.toAddress().toBech32("cosmos"),
      "cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"
    );
    assert.equal(
      (await localWalletProvider.getPubKey(
        context,
        Address.fromBech32(
          "cosmos",
          "cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"
        ).toBytes()
      ))
        .toAddress()
        .toBech32("cosmos"),
      "cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"
    );
  });
});
