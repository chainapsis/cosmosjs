// tslint:disable-next-line: no-implicit-dependencies no-var-requires
require("babel-polyfill");

import { GaiaApi } from "../src/gaia/api";
import { LedgerWalletProvider } from "../src/core/ledgerWallet";
import { MsgSend } from "../src/gaia/msgs/bank";
import { AccAddress } from "../src/common/address";
import { Coin } from "../src/common/coin";
import { Int } from "../src/common/int";
import bigInteger from "big-integer";

(async () => {
  // Here you can see the type of transport
  // https://github.com/LedgerHQ/ledgerjs
  const wallet = new LedgerWalletProvider("HID");
  /*
    // You should not use local wallet provider in production
    const wallet = new LocalWalletProvider(
    "anger river nuclear pig enlist fish demand dress library obtain concert nasty wolf episode ring bargain rely off vibrant iron cram witness extra enforce"
  );
  */

  const api = new GaiaApi({
    chainId: "cosmoshub-2",
    walletProvider: wallet,
    rpc: "http://35.245.26.237:26657",
    rest: "http://localhost:1317"
  });

  // You should sign in before using your wallet
  await api.signIn(0);

  const account = (await api.wallet.getSignerAccounts(api.context))[0];
  const accAddress = new AccAddress(account.address);

  await api.sendMsgs(
    [
      new MsgSend(accAddress, accAddress, [new Coin("uatom", new Int("1"))]),
      new MsgSend(accAddress, accAddress, [new Coin("uatom", new Int("1"))])
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
