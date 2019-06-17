import { GaiaApi } from "../src/gaia/api";
import { defaultBech32Config } from "../src/core/bech32Config";
import { LocalWalletProvider } from "../src/core/walletProvider";
import { MsgSend } from "../src/gaia/msgs/bank";
import { AccAddress, useGlobalBech32Config } from "../src/common/address";
import { Coin } from "../src/common/coin";
import { Int } from "../src/common/int";
import bigInteger from "big-integer";

(async () => {
  // You should not use local wallet provider in production
  const wallet = new LocalWalletProvider(
    "anger river nuclear pig enlist fish demand dress library obtain concert nasty wolf episode ring bargain rely off vibrant iron cram witness extra enforce"
  );
  const api = new GaiaApi({
    chainId: "cosmoshub-2",
    bech32Config: defaultBech32Config("cosmos"),
    walletProvider: wallet,
    rpc: "http://localhost:26657",
    rest: "http://localhost:1317"
  });

  useGlobalBech32Config(api.context.get("bech32Config"));

  // You should sign in before using your wallet
  await wallet.signIn("m/44'/118'/0'/0/0");

  await api.sendMsgs(
    [
      new MsgSend(
        AccAddress.fromBech32("cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"),
        AccAddress.fromBech32("cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"),
        [new Coin("uatom", new Int("1"))]
      ),
      new MsgSend(
        AccAddress.fromBech32("cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"),
        AccAddress.fromBech32("cosmos1t68n2ezn5zt8frh4jehmufkk2puakv9glapyz4"),
        [new Coin("uatom", new Int("1"))]
      )
    ],
    {
      // If account number or sequence is omitted, they are calculated automatically
      gas: bigInteger(60000),
      memo: "test",
      fee: new Coin("uatom", new Int("111")),
      gasPrice: 1
    },
    "commit"
  );
})();
