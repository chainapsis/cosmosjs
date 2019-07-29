import { Amino, Type } from "@node-a-team/ts-amino";
const { Field, DefineType, Concrete, marshalBinaryBare } = Amino;
import { Buffer } from "buffer/";
import ripemd160 from "ripemd160";
import secp256k1 from "secp256k1";
import { sha256 } from "sha.js";
import { Address, PrivKey, PubKey } from "./types";

@Concrete("tendermint/PrivKeySecp256k1")
@DefineType()
export class PrivKeySecp256k1 implements PrivKey {
  @Field.Array(0, { type: Type.Uint8 })
  private privKey: Uint8Array;

  constructor(privKey: Uint8Array) {
    this.privKey = privKey;
  }

  public toBytes(): Uint8Array {
    return marshalBinaryBare(this);
  }

  public toPubKey(): PubKey {
    const pubKey = secp256k1.publicKeyCreate(
      Buffer.from(this.privKey) as any,
      true
    );
    return new PubKeySecp256k1(pubKey);
  }

  public equals(privKey: PrivKey): boolean {
    return this.toBytes().toString() === privKey.toBytes().toString();
  }

  public sign(msg: Uint8Array): Uint8Array {
    return secp256k1.sign(
      Buffer.from(new sha256().update(msg).digest()) as any,
      Buffer.from(this.privKey) as any
    ).signature;
  }

  public toString(): string {
    return Buffer.from(this.privKey).toString("hex");
  }
}

@Concrete("tendermint/PubKeySecp256k1")
@DefineType()
export class PubKeySecp256k1 implements PubKey {
  @Field.Array(0, { type: Type.Uint8 })
  private pubKey: Uint8Array;

  constructor(pubKey: Uint8Array) {
    this.pubKey = pubKey;
  }

  public toBytes(): Uint8Array {
    return marshalBinaryBare(this);
  }

  public toAddress(): Address {
    let hash = new sha256().update(this.pubKey).digest("latin1");
    hash = new ripemd160().update(hash, "latin1").digest("hex");

    return new Address(Buffer.from(hash, "hex"));
  }

  public equals(pubKey: PubKey): boolean {
    return this.toBytes().toString() === pubKey.toBytes().toString();
  }

  public verify(msg: Uint8Array, sig: Uint8Array): boolean {
    return secp256k1.verify(
      Buffer.from(msg) as any,
      Buffer.from(sig) as any,
      Buffer.from(this.pubKey) as any
    );
  }

  public toString(): string {
    return Buffer.from(this.pubKey).toString("hex");
  }
}
