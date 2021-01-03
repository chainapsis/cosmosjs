import { Amino, Type } from "@chainapsis/ts-amino";
const { Field, DefineType, marshalBinaryBare } = Amino;
import { Buffer } from "buffer/";
import EC from "elliptic";
import CryptoJS from "crypto-js";
import { Address, PrivKey, PubKey } from "./types";

@DefineType()
export class PrivKeySecp256k1 implements PrivKey {
  @Field.Array(0, { type: Type.Uint8 })
  private privKey: Uint8Array;

  constructor(privKey: Uint8Array) {
    this.privKey = privKey;
  }

  /**
   * @returns Return amino encoded bytes (including prefix bytes for concrete type).
   */
  public toBytes(): Uint8Array {
    return marshalBinaryBare(this);
  }

  /**
   * @returns Return bytes without type info.
   */
  public serialize(): Uint8Array {
    return new Uint8Array(this.privKey);
  }

  public toPubKey(): PubKey {
    const secp256k1 = new EC.ec("secp256k1");

    const key = secp256k1.keyFromPrivate(this.privKey);
    return new PubKeySecp256k1(
      new Uint8Array(key.getPublic().encodeCompressed("array"))
    );
  }

  public equals(privKey: PrivKey): boolean {
    return this.toBytes().toString() === privKey.toBytes().toString();
  }

  public sign(msg: Uint8Array): Uint8Array {
    const secp256k1 = new EC.ec("secp256k1");
    const key = secp256k1.keyFromPrivate(this.privKey);

    const hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(msg)).toString();

    const signature = key.sign(Buffer.from(hash, "hex"), {
      canonical: true
    });

    return new Uint8Array(
      signature.r.toArray("be", 32).concat(signature.s.toArray("be", 32))
    );
  }

  public toString(): string {
    return Buffer.from(this.privKey).toString("hex");
  }
}

@DefineType()
export class PubKeySecp256k1 implements PubKey {
  @Field.Array(0, { type: Type.Uint8 })
  private pubKey: Uint8Array;

  constructor(pubKey: Uint8Array) {
    this.pubKey = pubKey;
  }

  /**
   * @returns Return amino encoded bytes (including prefix bytes for concrete type).
   */
  public toBytes(): Uint8Array {
    return marshalBinaryBare(this);
  }

  /**
   * @returns Return bytes without type info.
   */
  public serialize(): Uint8Array {
    return new Uint8Array(this.pubKey);
  }

  public toAddress(): Address {
    let hash = CryptoJS.SHA256(
      CryptoJS.lib.WordArray.create(this.pubKey)
    ).toString();
    hash = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(hash)).toString();

    return new Address(Buffer.from(hash, "hex"));
  }

  public equals(pubKey: PubKey): boolean {
    return this.toBytes().toString() === pubKey.toBytes().toString();
  }

  public verify(msg: Uint8Array, sig: Uint8Array): boolean {
    const secp256k1 = new EC.ec("secp256k1");
    const key = secp256k1.keyFromPublic(this.pubKey);

    const hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(msg)).toString();

    const signature = {
      r: sig.slice(0, 32),
      s: sig.slice(32)
    };

    return key.verify(Buffer.from(hash, "hex"), signature);
  }

  public toString(): string {
    return Buffer.from(this.pubKey).toString("hex");
  }
}
