import { Context } from "./context";
import { Tx, Msg } from "./tx";
import bigInteger from "big-integer";
import { Coin } from "../common/coin";

export interface TxBuilderConfig {
  /**
   * @param accountNumber - uint64
   */
  accountNumber?: bigInteger.BigNumber;
  /**
   * @param sequence - uint64
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
  gasAdjustment: number;
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
