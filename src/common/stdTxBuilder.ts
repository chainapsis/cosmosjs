import { TxBuilder, TxBuilderConfig } from "../core/txBuilder";
import { Tx, Msg } from "../core/tx";
import { StdTx, StdFee, StdSignature, StdSignDoc } from "./stdTx";
import { Context } from "../core/context";
import { AccAddress, useBech32ConfigPromise } from "./address";

export const stdTxBuilder: TxBuilder = (
  context: Context,
  msgs: Msg[],
  config: TxBuilderConfig
): Promise<Tx> => {
  return useBech32ConfigPromise(
    context.get("bech32Config"),
    async (): Promise<Tx> => {
      const stdFee = new StdFee([config.fee], config.gas);

      const signDoc = new StdSignDoc(
        config.accountNumber,
        context.get("chainId"),
        stdFee,
        config.memo,
        msgs,
        config.sequence
      );

      const seenSigners: any = {};
      const signers: AccAddress[] = [];
      for (const msg of msgs) {
        msg.validateBasic();
        for (const signer of msg.getSigners()) {
          if (!seenSigners[signer.toBytes().toString()]) {
            signers.push(signer);

            seenSigners[signer.toBytes().toString()] = true;
          }
        }
      }

      const signatures: StdSignature[] = [];
      for (const signer of signers) {
        const sig = await context
          .get("walletProvider")
          .sign(signer.toBytes(), signDoc.getSignBytes());

        const pubKey = await context
          .get("walletProvider")
          .getPubKey(signer.toBytes());

        const signature = new StdSignature(pubKey, sig);

        signatures.push(signature);
      }

      const stdTx = new StdTx(msgs, stdFee, signatures, config.memo);
      stdTx.validateBasic();
      return stdTx;
    }
  );
};
