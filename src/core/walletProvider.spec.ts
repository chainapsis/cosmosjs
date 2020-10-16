import assert from "assert";
import "mocha";
import { LocalWalletProvider } from "./walletProvider";

import crypto from "crypto";
import { PubKeySecp256k1 } from "../crypto";
import { Context } from "./context";
import { BIP44 } from "./bip44";
import { Codec } from "@chainapsis/ts-amino";
import { defaultBech32Config } from "./bech32Config";

describe("Test local wallet provider", () => {
  it("local wallet provider should generate correct priv key", async () => {
    const localWalletProvider = new LocalWalletProvider(
      "cosmos",
      "anger river nuclear pig enlist fish demand dress library obtain concert nasty wolf episode ring bargain rely off vibrant iron cram witness extra enforce",
      0,
      0,
      (array: any): any => {
        return crypto.randomBytes(array.length);
      }
    );

    const context: Context = new Context({
      chainId: "",
      txEncoder: undefined as any,
      txBuilder: undefined as any,
      bech32Config: defaultBech32Config("cosmos"),
      walletProvider: undefined as any,
      rpcInstance: undefined as any,
      restInstance: undefined as any,
      queryAccount: undefined as any,
      bip44: new BIP44(44, 118, 0),
      codec: new Codec(),
      isStargate: false
    });

    await localWalletProvider.enable(context);

    const keys = await localWalletProvider.getKeys(context);
    assert.strictEqual(keys.length, 1);

    const key = keys[0];
    assert.strictEqual(key.algo, "secp256k1");
    assert.strictEqual(
      new PubKeySecp256k1(key.pubKey).toAddress().toBech32("cosmos"),
      "cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"
    );
    assert.strictEqual(
      key.bech32Address,
      "cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"
    );
  });
});
