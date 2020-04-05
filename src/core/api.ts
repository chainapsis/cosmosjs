import { Context } from "./context";
import Axios, { AxiosInstance } from "axios";
import { TxEncoder, Msg } from "./tx";
import { TxBuilder, TxBuilderConfig } from "./txBuilder";
import { Bech32Config } from "./bech32Config";
import { Key, WalletProvider } from "./walletProvider";
import { TendermintRPC } from "../rpc/tendermint";
import { Rest } from "./rest";
import { QueryAccount } from "./account";
import { ResultBroadcastTx, ResultBroadcastTxCommit } from "../rpc/tx";
import { BIP44 } from "./bip44";
import { Codec } from "@node-a-team/ts-amino";

export interface ApiConfig {
  chainId: string;
  walletProvider: WalletProvider;
  /** Endpoint of rpc */
  rpc: string;
  /** Endpoint of rest api */
  rest: string;
}

export interface CoreConfig<R extends Rest> {
  /**
   * Encoder for transaction.
   */
  txEncoder: TxEncoder;
  /**
   * Builder for transaction.
   */
  txBuilder: TxBuilder;
  rpcInstanceFactory?: (rpc: string) => AxiosInstance;
  restInstanceFactory?: (rpc: string) => AxiosInstance;
  restFactory: (context: Context) => R;
  queryAccount: QueryAccount;
  bech32Config: Bech32Config;
  bip44: BIP44;
  registerCodec: (codec: Codec) => void;
}

export class Api<R extends Rest> {
  private _context: Context;
  private _rpc: TendermintRPC;
  private _rest: R;

  constructor(config: ApiConfig, coreConfig: CoreConfig<R>) {
    this._context = new Context({
      chainId: config.chainId,
      txEncoder: coreConfig.txEncoder,
      txBuilder: coreConfig.txBuilder,
      bech32Config: coreConfig.bech32Config,
      walletProvider: config.walletProvider,
      rpcInstance: coreConfig.rpcInstanceFactory
        ? coreConfig.rpcInstanceFactory(config.rpc)
        : Axios.create({
            baseURL: config.rpc
          }),
      restInstance: coreConfig.restInstanceFactory
        ? coreConfig.restInstanceFactory(config.rest)
        : Axios.create({
            baseURL: config.rest
          }),
      queryAccount: coreConfig.queryAccount,
      bip44: coreConfig.bip44,
      codec: new Codec()
    });

    coreConfig.registerCodec(this.context.get("codec"));

    this._rpc = new TendermintRPC(this.context);
    this._rest = coreConfig.restFactory(this.context);
  }

  public async enable(): Promise<void> {
    await this.wallet.enable(this.context);
    return Promise.resolve();
  }

  public async getKeys(): Promise<Key[]> {
    return await this.wallet.getKeys(this.context);
  }

  /**
   * Send msgs.
   * @return If mode is commit, this will return [[ResultBroadcastTx]].
   * Or if mode is sync or async, this will return [[ResultBroadcastTxCommit]].
   */
  public async sendMsgs(
    msgs: Msg[],
    config: TxBuilderConfig,
    mode: "commit" | "sync" | "async" = "sync"
  ): Promise<ResultBroadcastTx | ResultBroadcastTxCommit> {
    const tx = await this.context.get("txBuilder")(this.context, msgs, config);
    const bz = this.context.get("txEncoder")(this.context, tx);
    if (mode === "commit") {
      return this.rpc.broadcastTxCommit(bz);
    } else {
      return this.rpc.broadcastTx(bz, mode);
    }
  }

  get context(): Context {
    return this._context;
  }

  get wallet(): WalletProvider {
    return this.context.get("walletProvider");
  }

  get rpc(): TendermintRPC {
    return this._rpc;
  }

  get rest(): R {
    return this._rest;
  }
}
