import { Api, ApiConfig } from "../core/api";
import { Rest } from "../core/rest";
import { defaultTxEncoder } from "../common/stdTx";
import { stdTxBuilder } from "../common/stdTxBuilder";
import { Context } from "../core/context";

export class GaiaApi extends Api<Rest> {
  constructor(config: ApiConfig) {
    super(config, {
      txEncoder: defaultTxEncoder,
      txBuilder: stdTxBuilder,
      restFactory: (context: Context) => {
        return new Rest(context);
      }
    });
  }
}
