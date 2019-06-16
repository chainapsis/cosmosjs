import { RPC } from "../core/rpc";
import { Context } from "../core/context";
import { Buffer } from "buffer/";

export class TendermintRPC extends RPC {
  constructor(context: Context) {
    super(context);
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
