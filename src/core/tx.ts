import { AccAddress } from "../common/address";
import { Amino } from "@node-a-team/ts-amino";
const { marshalJson } = Amino;
import { Buffer } from "buffer/";
import { sortJSON } from "../utils/sortJson";

export interface Tx {
  getMsgs(): Msg[];
  /**
   * ValidateBasic does a simple validation check that
   * doesn't require access to any other information.
   * You can throw error in this when tx is invalid.
   */
  validateBasic(): void;
}

export class Msg {
  /**
   * ValidateBasic does a simple validation check that
   * doesn't require access to any other information.
   * You can throw error in this when msg is invalid.
   */
  // tslint:disable-next-line: no-empty
  public validateBasic(): void {}
  /**
   * Get the canonical byte representation of the Msg.
   * @return Return sorted by alphabetically amino encoded json by default.
   */
  public getSignBytes(): Uint8Array {
    return Buffer.from(sortJSON(marshalJson(this)), "utf8");
  }
  public getSigners(): AccAddress[] {
    throw new Error("You should implement getSigners()");
  }
}

export type TxEncoder = (tx: Tx) => Uint8Array;
