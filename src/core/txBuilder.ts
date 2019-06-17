import { Context } from "./context";
import { Tx, Msg } from "./tx";
import bigInteger from "big-integer";
import { Coin } from "../common/coin";

export interface TxBuilderConfig {
  /**
   * @param accountNumber - uint64, If this is undefined or negative, tx builder should calculate that automatically or throw error.
   * If there are several signers, this should be undefined or negative.
   */
  accountNumber?: bigInteger.BigNumber;
  /**
   * @param sequence - uint64, If this is undefined or negative, tx builder should calculate that automatically or throw error.
   * If there are several signers, this should be undefined or negative.
   */
  sequence?: bigInteger.BigNumber;
  /**
   * @param gas - uint64, How much gas will it consume.<br/>
   * TODO: If this parameter is negative, this means that gas will be set automatically with simulated value.
   */
  gas: bigInteger.BigNumber;
  /**
   * @param gasAdjustment - TODO: If gas parameter is negative(auto), simulated gas will be multiplied with this.
   */
  gasAdjustment?: number;
  memo: string;
  // TODO: support multi-asset fee
  fee: Coin;
  // TODO: support multi-asset fee
  gasPrice: number;
}

export type TxBuilder = (
  context: Context,
  msgs: Msg[],
  config: TxBuilderConfig
) => Promise<Tx>;
