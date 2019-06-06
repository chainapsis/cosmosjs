import { TxEncoder } from "./tx";
import { AxiosInstance } from "axios";
import { TxBuilder } from "./txBuilder";

export class ImmutableContext<T> {
  constructor(private context: T) {}

  public get<K extends keyof T>(key: K): T[K] {
    return this.context[key] as T[K];
  }

  public set<K extends keyof T>(key: K, value: T[K]): ImmutableContext<T> {
    return new ImmutableContext<T>({ ...this.context, ...{ [key]: value } });
  }
}

export interface IContext {
  chainId: string;
  txEncoder: TxEncoder;
  txBuilder: TxBuilder;
  rpc: AxiosInstance;
  rest: AxiosInstance;
}

export class Context extends ImmutableContext<IContext> {}
