import { RPC } from "../core/rpc";
import { Context } from "../core/context";
import { AxiosInstance } from "axios";
import { Buffer } from "buffer/";

export class TendermintRPC extends RPC {
  private instance: AxiosInstance;

  constructor(context: Context) {
    super(context);
    this.instance = context.get("rpcInstance");
  }

  public broadcastTx(
    tx: Uint8Array,
    mode: "commit" | "sync" | "async"
  ): Promise<any> {
    const hex = Buffer.from(tx).toString("hex");
    return this.instance.get(`/broadcast_tx_${mode}`, {
      params: {
        tx: "0x" + hex
      }
    });
  }
}
