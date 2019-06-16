import { AccAddress } from "../common/address";
import { PubKey } from "../crypto";
import bigInteger from "big-integer";
import { Coin } from "../common/coin";

export interface Account {
  getAddress(): AccAddress;
  getPubKey(): PubKey;
  getAccountNumber(): bigInteger.BigInteger;
  getSequence(): bigInteger.BigInteger;
  getCoins(): Coin[];
}
