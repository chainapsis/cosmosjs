import { Context } from "./context";
import Axios from "axios";
import { TxEncoder, Msg } from "./tx";
import { TxBuilder, TxBuilderConfig } from "./txBuilder";
import { defaultTxEncoder } from "../common/stdTx";
import { Bech32Config } from "./bech32Config";
import { WalletProvider } from "./walletProvider";
import { TendermintRPC } from "../rpc/tendermint";
import { Rest } from "./rest";

export interface ApiConfig {
  chainId: string;
  /**
   * Encoder for transaction.<br/>
   * If this parameter is undefined,
   * this uses default encoder that uses amino marshalBinaryLengthPrefixed instead.
   */
  txEncoder?: TxEncoder;
  /**
   * Builder for transaction.<br/>
   * If this parameter is undefined,
   * this uses default standard builder.
   */
  txBuilder: TxBuilder;
  bech32Config: Bech32Config;
  walletProvider: WalletProvider;
  /** Endpoint of rpc */
  rpc: string;
  /** Endpoint of rest api */
  rest: string;
}

export class Api<R extends Rest> {
  // tslint:disable-next-line: variable-name
  private _context: Context;
  // tslint:disable-next-line: variable-name
  private _rpc: TendermintRPC;
  // tslint:disable-next-line: variable-name
  private _rest: R;

  constructor(config: ApiConfig, restFactory: (context: Context) => R) {
    this._context = new Context({
      chainId: config.chainId,
      txEncoder: config.txEncoder ? config.txEncoder : defaultTxEncoder,
      txBuilder: config.txBuilder,
      bech32Config: config.bech32Config,
      walletProvider: config.walletProvider,
      rpcInstance: Axios.create({
        baseURL: config.rpc
      }),
      restInstance: Axios.create({
        baseURL: config.rest
      })
    });

    this._rpc = new TendermintRPC(this.context);
    this._rest = restFactory(this.context);
  }

  public async sendMsgs(
    msgs: Msg[],
    config: TxBuilderConfig,
    mode: "commit" | "sync" | "async" = "sync"
  ): Promise<void> {
    const tx = await this.context.get("txBuilder")(this.context, msgs, config);
    const bz = this.context.get("txEncoder")(tx);
    return this.rpc.broadcastTx(bz, mode);
  }

  get context(): Context {
    return this._context;
  }

  get rpc(): TendermintRPC {
    return this._rpc;
  }

  get rest(): R {
    return this._rest;
  }
}
