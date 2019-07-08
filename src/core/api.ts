import { Context } from "./context";
import Axios from "axios";
import { TxEncoder, Msg } from "./tx";
import { TxBuilder, TxBuilderConfig } from "./txBuilder";
import { Bech32Config } from "./bech32Config";
import { useGlobalBech32Config } from "../common/address";
import { WalletProvider } from "./walletProvider";
import { TendermintRPC } from "../rpc/tendermint";
import { Rest } from "./rest";
import { QueryAccount } from "./account";
import { ResultBroadcastTx, ResultBroadcastTxCommit } from "../rpc/tx";
import { BIP44 } from "./bip44";

export interface ApiConfig {
  chainId: string;
  walletProvider: WalletProvider;
  /** Endpoint of rpc */
  rpc: string;
  /** Endpoint of rest api */
  rest: string;
  disableGlobalBech32Config?: boolean;
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
  restFactory: (context: Context) => R;
  queryAccount: QueryAccount;
  bech32Config: Bech32Config;
  bip44: BIP44;
}

export class Api<R extends Rest> {
  // tslint:disable-next-line: variable-name
  private _context: Context;
  // tslint:disable-next-line: variable-name
  private _rpc: TendermintRPC;
  // tslint:disable-next-line: variable-name
  private _rest: R;

  constructor(config: ApiConfig, coreConfig: CoreConfig<R>) {
    this._context = new Context({
      chainId: config.chainId,
      txEncoder: coreConfig.txEncoder,
      txBuilder: coreConfig.txBuilder,
      bech32Config: coreConfig.bech32Config,
      walletProvider: config.walletProvider,
      rpcInstance: Axios.create({
        baseURL: config.rpc
      }),
      restInstance: Axios.create({
        baseURL: config.rest
      }),
      queryAccount: coreConfig.queryAccount,
      bip44: coreConfig.bip44
    });

    this._rpc = new TendermintRPC(this.context);
    this._rest = coreConfig.restFactory(this.context);

    if (!config.disableGlobalBech32Config) {
      useGlobalBech32Config(coreConfig.bech32Config);
    }
  }

  public async signIn(index: number, change: number = 0): Promise<void> {
    await this.wallet.signIn(this.context, index, change);
    return Promise.resolve();
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
    const bz = this.context.get("txEncoder")(tx);
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
