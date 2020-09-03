import { Codec } from "@chainapsis/ts-amino";
import * as StdTx from "./stdTx";

export function registerCodec(codec: Codec) {
  StdTx.registerCodec(codec);
}
