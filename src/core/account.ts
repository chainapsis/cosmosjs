import { AccAddress } from "../common/address";
import { PubKey } from "../crypto";
import bigInteger from "big-integer";
import { Coin } from "../common/coin";
import { Context } from "./context";

export interface Account {
  getAddress(): AccAddress;
  getPubKey(): PubKey | undefined; // If an account haven't sent tx at all, pubKey is undefined.;
  getAccountNumber(): bigInteger.BigInteger;
  getSequence(): bigInteger.BigInteger;
  getCoins(): Coin[];
}

export type QueryAccount = (
  context: Context,
  address: string | Uint8Array,
  isStargate: boolean
) => Promise<Account>;
