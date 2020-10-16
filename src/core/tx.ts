import { AccAddress } from "../common/address";
import { Codec } from "@chainapsis/ts-amino";
import { Buffer } from "buffer/";
import { sortJSON } from "../utils/sortJson";
import { Context } from "./context";

export interface Tx {
  getMsgs(): Msg[];
  /**
   * ValidateBasic does a simple validation check that
   * doesn't require access to any other information.
   * You can throw error in this when tx is invalid.
   */
  validateBasic(): void;
}

export abstract class Msg {
  /**
   * ValidateBasic does a simple validation check that
   * doesn't require access to any other information.
   * You can throw error in this when msg is invalid.
   */
  public abstract validateBasic(): void;
  /**
   * Get the canonical byte representation of the Msg.
   * @return Return sorted by alphabetically amino encoded json by default.
   */
  public getSignBytes(codec: Codec): Uint8Array {
    return Buffer.from(sortJSON(codec.marshalJson(this)), "utf8");
  }
  public getSigners(): AccAddress[] {
    throw new Error("You should implement getSigners()");
  }
}

export type TxEncoder = (conext: Context, tx: Tx, json: boolean) => Uint8Array;
