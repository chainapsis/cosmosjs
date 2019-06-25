import { JSONRPC } from "./types";
import bigInteger from "big-integer";
import { Buffer } from "buffer/";

export class ResultABCIInfo {
  public static fromJSON(obj: JSONRPC): ResultABCIInfo {
    return new ResultABCIInfo(ABCIResponseInfo.fromJSON(obj.result.response));
  }

  constructor(public readonly response: ABCIResponseInfo) {}
}

export class ABCIResponseInfo {
  public static fromJSON(obj: any): ABCIResponseInfo {
    return new ABCIResponseInfo(
      obj.data,
      obj.version,
      obj.app_version,
      obj.last_block_height,
      obj.last_block_app_hash
    );
  }

  constructor(
    public readonly data: string,
    public readonly version: string | undefined,
    public readonly appVersion: string | undefined,
    public readonly lastBlockHeight: bigInteger.BigInteger,
    public readonly lastBlockAppHash: string
  ) {}
}

export class ResultABCIQuery {
  public static fromJSON(obj: JSONRPC): ResultABCIQuery {
    return new ResultABCIQuery(ABCIResponseQuery.fromJSON(obj.result.response));
  }

  constructor(public readonly response: ABCIResponseQuery) {}
}

export class ABCIResponseQuery {
  public static fromJSON(obj: any): ABCIResponseQuery {
    return new ABCIResponseQuery(
      Buffer.from(obj.key, "base64"),
      Buffer.from(obj.value, "base64"),
      bigInteger(obj.height)
    );
  }

  // TODO: add code, proofs and so on...
  constructor(
    public readonly key: Uint8Array,
    public readonly value: Uint8Array,
    public readonly height: bigInteger.BigInteger
  ) {}
}

export interface ABCIQueryOptions {
  height: bigInteger.BigNumber;
  prove: boolean;
}
