import { TxEncoder } from "./tx";
import { AxiosInstance } from "axios";
import { TxBuilder } from "./txBuilder";
import { Bech32Config } from "./bech32Config";
import { WalletProvider } from "./walletProvider";
import { QueryAccount } from "./account";

export class ImmutableContext<T> {
  constructor(private context: T) {}

  public get<K extends keyof T>(key: K): T[K] {
    return this.context[key] as T[K];
  }

  public set<K extends keyof T>(key: K, value: T[K]): ImmutableContext<T> {
    return new ImmutableContext<T>({ ...this.context, ...{ [key]: value } });
  }
}

export interface IContext<> {
  chainId: string;
  txEncoder: TxEncoder;
  txBuilder: TxBuilder;
  bech32Config: Bech32Config;
  walletProvider: WalletProvider;
  rpcInstance: AxiosInstance;
  restInstance: AxiosInstance;
  queryAccount: QueryAccount;
}

export class Context extends ImmutableContext<IContext> {}
