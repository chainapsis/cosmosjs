import { Context } from "./context";
import Axios from "axios";
import { TxEncoder, Msg } from "./tx";
import { TxBuilder, TxBuilderConfig } from "./txBuilder";
import { defaultTxEncoder } from "../common/stdTx";
import { Bech32Config } from "./bech32Config";
import { WalletProvider } from "./walletProvider";
import { TendermintRPC } from "../rpc/tendermint";

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

export class Api {
  // tslint:disable-next-line: variable-name
  private _context: Context;

  constructor(config: ApiConfig) {
    this._context = new Context({
      chainId: config.chainId,
      txEncoder: config.txEncoder ? config.txEncoder : defaultTxEncoder,
      txBuilder: config.txBuilder,
      bech32Config: config.bech32Config,
      walletProvider: config.walletProvider,
      rpc: new TendermintRPC(this.context, config.rpc),
      rest: Axios.create({
        baseURL: config.rest
      })
    });
  }

  public async sendMsgs(
    msgs: Msg[],
    config: TxBuilderConfig,
    mode: "commit" | "sync" | "async" = "sync"
  ): Promise<void> {
    const tx = await this.context.get("txBuilder")(this.context, msgs, config);
    const bz = this.context.get("txEncoder")(tx);
    return this.context.get("rpc").broadcastTx(bz, mode);
  }

  get context(): Context {
    return this._context;
  }
}
