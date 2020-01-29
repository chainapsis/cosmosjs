import { GaiaApi } from "../src/gaia/api";
import { LedgerWalletProvider } from "../src/core/ledgerWallet";
import { MsgSend } from "../src/x/bank";
import { AccAddress } from "../src/common/address";
import { Coin } from "../src/common/coin";
import { Int } from "../src/common/int";
import bigInteger from "big-integer";

(async () => {
  // Here you can see the type of transport
  // https://github.com/LedgerHQ/ledgerjs
  const wallet = new LedgerWalletProvider("HID", "cosmos");
  /*
    // You should not use local wallet provider in production
    const wallet = new LocalWalletProvider(
    "anger river nuclear pig enlist fish demand dress library obtain concert nasty wolf episode ring bargain rely off vibrant iron cram witness extra enforce"
  );
  */

  const api = new GaiaApi({
    chainId: "cosmoshub-3",
    walletProvider: wallet,
    rpc: "http://localhost:26657",
    rest: "http://localhost:1317"
  });

  // You should sign in before using your wallet
  await api.enable();

  const key = (await api.getKeys())[0];
  const accAddress = new AccAddress(key.address, "cosmos");

  await api.sendMsgs(
    [
      new MsgSend(accAddress, accAddress, [new Coin("uatom", new Int("1"))]),
      new MsgSend(accAddress, accAddress, [new Coin("uatom", new Int("1"))])
    ],
    {
      // If account number or sequence is omitted, they are calculated automatically
      gas: bigInteger(60000),
      memo: "test",
      fee: new Coin("uatom", new Int("111"))
    },
    "commit"
  );
})();
