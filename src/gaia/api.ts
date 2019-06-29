import { Api, ApiConfig } from "../core/api";
import { GaiaRest } from "./rest";
import { defaultTxEncoder } from "../common/stdTx";
import { stdTxBuilder } from "../common/stdTxBuilder";
import { Context } from "../core/context";
import { Account } from "../core/account";
import { BIP44 } from "../core/bip44";

export class GaiaApi extends Api<GaiaRest> {
  constructor(config: ApiConfig) {
    super(config, {
      txEncoder: defaultTxEncoder,
      txBuilder: stdTxBuilder,
      restFactory: (context: Context) => {
        return new GaiaRest(context);
      },
      queryAccount: (
        context: Context,
        address: string | Uint8Array
      ): Promise<Account> => {
        return this.rest.getAccount(address);
      },
      bip44: new BIP44(44, 118, 0)
    });
  }
}
