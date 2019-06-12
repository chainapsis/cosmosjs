import { RPC } from "../core/rpc";
import { Context } from "../core/context";
import Axios, { AxiosInstance } from "axios";
import { Buffer } from "buffer/";

export class TendermintRPC extends RPC {
  private rpc: AxiosInstance;

  constructor(context: Context, baseURL: string) {
    super(context);
    this.rpc = Axios.create({
      baseURL
    });
  }

  public broadcastTx(
    tx: Uint8Array,
    mode: "commit" | "sync" | "async"
  ): Promise<any> {
    const hex = Buffer.from(tx).toString("hex");
    return this.rpc.get(`/broadcast_tx_${mode}`, {
      params: {
        tx: "0x" + hex
      }
    });
  }
}
