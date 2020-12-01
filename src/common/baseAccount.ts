import { AccAddress } from "./address";
import { PubKey, PubKeySecp256k1 } from "../crypto";
import bigInteger from "big-integer";
import { Coin } from "./coin";
import { Int } from "./int";
import { Buffer } from "buffer/";
import { Account } from "../core/account";

const vestingAccountTypes = [
  "auth/ContinuousVestingAccount",
  "auth/DelayedVestingAccount",
  "auth/PeriodicVestingAccount",
  "cosmos-sdk/ContinuousVestingAccount",
  "cosmos-sdk/DelayedVestingAccount",
  "cosmos-sdk/PeriodicVestingAccount"
];

function isVestingAccountType(type: string): boolean {
  return vestingAccountTypes.indexOf(type) > -1;
}

export class BaseAccount implements Account {
  public static fromJSON(obj: any): BaseAccount {
    if (obj.height) {
      obj = obj.result;
    }

    const supportedAccountType = [
      "auth/Account",
      "cosmos-sdk/Account",
      "cosmos-sdk/BaseAccount",
      ...vestingAccountTypes
    ];
    if (supportedAccountType.indexOf(obj.type) < 0) {
      throw new Error(`Unsupported account type: ${obj.type}`);
    }
    if (obj.value) {
      const toBaseAccount = (value: any): BaseAccount => {
        const address = AccAddress.fromBech32(value.address);
        const coins: Coin[] = [];
        if (value.coins) {
          for (const coin of value.coins) {
            coins.push(new Coin(coin.denom, new Int(coin.amount)));
          }
        }
        let pubKey: PubKey | undefined;
        if (value.public_key) {
          if (value.public_key.type === undefined) {
            pubKey = new PubKeySecp256k1(
              Buffer.from(value.public_key, "base64")
            );
          } else if (value.public_key.type !== "tendermint/PubKeySecp256k1") {
            throw new Error(
              `Unsupported public key type: ${value.public_key.type}`
            );
          } else {
            pubKey = new PubKeySecp256k1(
              Buffer.from(value.public_key.value, "base64")
            );
          }
        }

        const accountNumber = value.account_number;
        const sequence = value.sequence;

        return new BaseAccount(address, pubKey, accountNumber, sequence, coins);
      };

      if (isVestingAccountType(obj.type)) {
        // If account is vesting account, take out the base account from it with ignoring the vesting.
        const baseVestingAccountObj =
          obj.value.BaseVestingAccount || obj.value.baseVestingAccount;
        let baseAccountObj: any;

        if (baseVestingAccountObj) {
          baseAccountObj =
            baseVestingAccountObj.BaseAccount ||
            baseVestingAccountObj.baseAccount;
        } else {
          baseAccountObj = obj.value;
        }

        return toBaseAccount(baseAccountObj);
      }
      return toBaseAccount(obj.value);
    } else {
      throw new Error("Invalid base account");
    }
  }

  private address: AccAddress;
  private pubKey: PubKey | undefined; // If an account haven't sent tx at all, pubKey is undefined.
  private accountNumber: bigInteger.BigInteger;
  private sequence: bigInteger.BigInteger;
  private coins: Coin[];

  constructor(
    address: AccAddress,
    pubKey: PubKey | undefined,
    accountNumber: bigInteger.BigNumber,
    sequence: bigInteger.BigNumber,
    coins: Coin[]
  ) {
    this.address = address;
    this.pubKey = pubKey;
    if (typeof accountNumber === "string") {
      this.accountNumber = bigInteger(accountNumber);
    } else if (typeof accountNumber === "number") {
      this.accountNumber = bigInteger(accountNumber);
    } else {
      this.accountNumber = bigInteger(accountNumber);
    }
    if (typeof sequence === "string") {
      this.sequence = bigInteger(sequence);
    } else if (typeof sequence === "number") {
      this.sequence = bigInteger(sequence);
    } else {
      this.sequence = bigInteger(sequence);
    }
    this.coins = coins;
  }

  public getAddress(): AccAddress {
    return this.address;
  }

  public getPubKey(): PubKey | undefined {
    return this.pubKey;
  }

  public getAccountNumber(): bigInteger.BigInteger {
    return this.accountNumber;
  }

  public getSequence(): bigInteger.BigInteger {
    return this.sequence;
  }

  public getCoins(): Coin[] {
    return this.coins;
  }
}
