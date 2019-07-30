import { Codec } from "@node-a-team/ts-amino";
import * as StdTx from "./stdTx";

export function registerCodec(codec: Codec) {
  StdTx.registerCodec(codec);
}
