import { JSONRPC } from "./types";
import bigInteger from "big-integer";

export class ResultStatus {
  public static fromJSON(obj: JSONRPC): ResultStatus {
    return new ResultStatus(
      NodeInfo.fromJSON(obj.result.node_info),
      SyncInfo.fromJSON(obj.result.sync_info),
      ValidatorInfo.fromJSON(obj.result.validator_info)
    );
  }

  constructor(
    public readonly nodeInfo: NodeInfo,
    public readonly syncInfo: SyncInfo,
    public readonly validatorInfo: ValidatorInfo
  ) {}
}

export class NodeInfo {
  public static fromJSON(obj: any): NodeInfo {
    return new NodeInfo(
      {
        p2p: parseInt(obj.protocol_version.p2p, 10),
        block: parseInt(obj.protocol_version.block, 10),
        app: parseInt(obj.protocol_version.app, 10)
      },
      obj.id,
      obj.listen_addr,
      obj.network,
      obj.version,
      obj.channels,
      obj.moniker,
      {
        txIndex: obj.other.tx_index === "on" ? true : false,
        rpcAddress: obj.other.rpc_address
      }
    );
  }

  constructor(
    public readonly protocolVersion: {
      p2p: number;
      block: number;
      app: number;
    },
    public readonly id: string,
    public readonly listenAddr: string,
    public readonly network: string,
    public readonly version: string,
    public readonly channels: string,
    public readonly moniker: string,
    public readonly other: {
      txIndex: boolean;
      rpcAddress: string;
    }
  ) {}
}

export class SyncInfo {
  public static fromJSON(obj: any): SyncInfo {
    return new SyncInfo(
      obj.latest_block_hash,
      obj.latest_app_hash,
      bigInteger(obj.latest_block_height),
      new Date(obj.latest_block_time),
      obj.catching_up
    );
  }

  constructor(
    public readonly latestBlockHash: string,
    public readonly latestAppHash: string,
    public readonly latestBlockHeight: bigInteger.BigInteger,
    public readonly latestBlockTime: Date,
    public readonly catchingUp: boolean
  ) {}
}

export class ValidatorInfo {
  public static fromJSON(obj: any): ValidatorInfo {
    return new ValidatorInfo(obj.address, obj.voting_power);
  }

  constructor(
    public readonly address: string,
    // TODO: Suport validator pubkey when Ed25519 is implemented
    // public readonly pubKey:PubKey,
    public readonly votingPower: bigInteger.BigInteger
  ) {}
}
