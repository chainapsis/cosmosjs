import { Amino, Type } from "@node-a-team/ts-amino";
const { Field, Concrete, DefineStruct, DefineType } = Amino;
import { Msg } from "../../core/tx";
import { AccAddress } from "../../common/address";
import { Coin } from "../../common/coin";
import { Int } from "../../common/int";
import bigInteger from "big-integer";

@DefineType()
export class ProposalKind {
  public static get nil(): number {
    return 0;
  }
  public static get text(): number {
    return 1;
  }
  public static get parameterChange(): number {
    return 2;
  }
  public static get softwareUpgread(): number {
    return 3;
  }

  @Field.Uint8(0)
  // tslint:disable-next-line: variable-name
  private _kind: number;

  constructor(kind: 0 | 1 | 2 | 3) {
    this._kind = kind;
  }

  public validateBasic(): void {
    if (this.kind < 0 || this.kind > 3) {
      throw new Error(`Invalid proposal kind: ${this.kind}`);
    }
  }

  public get kind(): number {
    return this._kind;
  }
}

@DefineType()
export class VoteOption {
  public static get empty(): number {
    return 0;
  }
  public static get yes(): number {
    return 1;
  }
  public static get abstain(): number {
    return 2;
  }
  public static get no(): number {
    return 3;
  }
  public static get noWithVeto(): number {
    return 4;
  }

  @Field.Uint8(0)
  // tslint:disable-next-line: variable-name
  private _option: number;

  constructor(option: 0 | 1 | 2 | 3 | 4) {
    this._option = option;
  }

  public validateBasic(): void {
    if (this.option < 0 || this.option > 4) {
      throw new Error(`Invalid proposal kind: ${this.option}`);
    }
  }

  public get option(): number {
    return this._option;
  }
}

@Concrete("cosmos-sdk/MsgSubmitProposal")
@DefineStruct()
export class MsgSubmitProposal extends Msg {
  @Field.String(0, {
    jsonName: "title"
  })
  public title: string;

  @Field.String(1, {
    jsonName: "description"
  })
  public description: string;

  @Field.Defined(2, {
    jsonName: "proposal_type"
  })
  public proposalType: ProposalKind;

  @Field.Defined(3, {
    jsonName: "proposer"
  })
  public proposer: AccAddress;

  @Field.Slice(
    4,
    {
      type: Type.Defined
    },
    {
      jsonName: "initial_deposit"
    }
  )
  public initialDeposit: Coin[];

  constructor(
    title: string,
    description: string,
    proposalType: ProposalKind,
    proposer: AccAddress,
    initialDeposit: Coin[]
  ) {
    super();
    this.title = title;
    this.description = description;
    this.proposalType = proposalType;
    this.proposer = proposer;
    this.initialDeposit = initialDeposit;
  }

  public getSigners(): AccAddress[] {
    return [this.proposer];
  }

  public validateBasic(): void {
    this.proposalType.validateBasic();
  }
}

@Concrete("cosmos-sdk/MsgDeposit")
@DefineStruct()
export class MsgDeposit extends Msg {
  @Field.Uint64(0, {
    jsonName: "proposal_id"
  })
  public proposalId: bigInteger.BigInteger;

  @Field.Defined(1, {
    jsonName: "depositor"
  })
  public depositor: AccAddress;

  @Field.Slice(
    2,
    { type: Type.Defined },
    {
      jsonName: "amount"
    }
  )
  public amount: Coin[];

  constructor(
    proposalId: bigInteger.BigNumber,
    depositor: AccAddress,
    amount: Coin[]
  ) {
    super();
    if (typeof proposalId === "string") {
      this.proposalId = bigInteger(proposalId);
    } else if (typeof proposalId === "number") {
      this.proposalId = bigInteger(proposalId);
    } else {
      this.proposalId = bigInteger(proposalId);
    }
    this.depositor = depositor;
    this.amount = amount;
  }

  public getSigners(): AccAddress[] {
    return [this.depositor];
  }

  public validateBasic(): void {
    for (const coin of this.amount) {
      if (coin.amount.lte(new Int(0))) {
        throw new Error("Deposit amount is invalid");
      }
    }
  }
}

@Concrete("cosmos-sdk/MsgVote")
@DefineStruct()
export class MsgVote extends Msg {
  @Field.Uint64(0, {
    jsonName: "proposal_id"
  })
  public proposalId: bigInteger.BigInteger;

  @Field.Defined(1, {
    jsonName: "voter"
  })
  public voter: AccAddress;

  @Field.Defined(2, {
    jsonName: "option"
  })
  public option: VoteOption;

  constructor(
    proposalId: bigInteger.BigNumber,
    voter: AccAddress,
    option: VoteOption
  ) {
    super();
    if (typeof proposalId === "string") {
      this.proposalId = bigInteger(proposalId);
    } else if (typeof proposalId === "number") {
      this.proposalId = bigInteger(proposalId);
    } else {
      this.proposalId = bigInteger(proposalId);
    }
    this.voter = voter;
    this.option = option;
  }

  public getSigners(): AccAddress[] {
    return [this.voter];
  }

  public validateBasic(): void {
    this.option.validateBasic();
  }
}
