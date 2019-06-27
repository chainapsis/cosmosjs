import { JSONRPC } from "./types";
import { Buffer } from "buffer/";
import bigInteger from "big-integer";

export class ResultBroadcastTx {
  public static fromJSON(
    obj: JSONRPC,
    mode: "async" | "sync"
  ): ResultBroadcastTx {
    const result = obj.result;

    return new ResultBroadcastTx(
      mode,
      result.code,
      Buffer.from(result.data, "hex"),
      result.log,
      Buffer.from(result.hash, "hex")
    );
  }

  constructor(
    public readonly mode: "async" | "sync",
    public readonly code: number,
    public readonly data: Uint8Array,
    public readonly log: string,
    public readonly hash: Uint8Array
  ) {}
}

export class ResultBroadcastTxCommit {
  public static fromJSON(obj: JSONRPC): ResultBroadcastTxCommit {
    const result = obj.result;

    return new ResultBroadcastTxCommit(
      "commit",
      ResponseCheckTx.fromJSON(result.check_tx),
      ResponseDeliverTx.fromJSON(result.deliver_tx),
      Buffer.from(result.hash, "hex"),
      bigInteger(result.height)
    );
  }

  constructor(
    public readonly mode: "commit",
    public readonly checkTx: ResponseCheckTx,
    public readonly deliverTx: ResponseDeliverTx,
    public readonly hash: Uint8Array,
    public readonly height: bigInteger.BigInteger
  ) {}
}

export class ResponseCheckTx {
  public static fromJSON(obj: any): ResponseCheckTx {
    const tags: Array<{
      key: Uint8Array;
      value: Uint8Array;
    }> = [];
    if (obj.tags) {
      for (const tag of obj.tags) {
        tags.push({
          key: Buffer.from(tag.key, "base64"),
          value: Buffer.from(tag.value, "base64")
        });
      }
    }

    return new ResponseCheckTx(
      obj.code,
      obj.data ? Buffer.from(obj.data, "base64") : Buffer.from([]),
      obj.log,
      obj.info,
      bigInteger(obj.gas_wanted),
      bigInteger(obj.gas_used),
      tags,
      obj.codespace
    );
  }

  constructor(
    public readonly code: number | undefined,
    public readonly data: Uint8Array,
    public readonly log: string | undefined,
    public readonly info: string | undefined,
    public readonly gasWanted: bigInteger.BigInteger,
    public readonly gasUsed: bigInteger.BigInteger,
    public readonly tags: Array<{
      key: Uint8Array;
      value: Uint8Array;
    }>,
    public readonly codespace: string | undefined
  ) {}
}

export class ResponseDeliverTx {
  public static fromJSON(obj: any): ResponseDeliverTx {
    const tags: Array<{
      key: Uint8Array;
      value: Uint8Array;
    }> = [];
    if (obj.tags) {
      for (const tag of obj.tags) {
        tags.push({
          key: Buffer.from(tag.key, "base64"),
          value: Buffer.from(tag.value, "base64")
        });
      }
    }

    return new ResponseDeliverTx(
      obj.code,
      obj.data ? Buffer.from(obj.data, "base64") : Buffer.from([]),
      obj.log,
      obj.info,
      bigInteger(obj.gas_wanted),
      bigInteger(obj.gas_used),
      tags,
      obj.codespace
    );
  }

  constructor(
    public readonly code: number | undefined,
    public readonly data: Uint8Array,
    public readonly log: string | undefined,
    public readonly info: string | undefined,
    public readonly gasWanted: bigInteger.BigInteger,
    public readonly gasUsed: bigInteger.BigInteger,
    public readonly tags: Array<{
      key: Uint8Array;
      value: Uint8Array;
    }>,
    public readonly codespace: string | undefined
  ) {}
}
