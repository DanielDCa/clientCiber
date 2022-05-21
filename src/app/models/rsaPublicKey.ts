import * as cryptoUtils from 'bigint-crypto-utils';
import * as bigintConversion from 'bigint-conversion';

export class RsaPublicKey {

  e: bigint;
  n: bigint;

  r: bigint;
  bitLength: number = 1024;

  constructor(e: bigint, n: bigint) {
    this.e = e;
    this.n = n;
    this.r = 0n;
    //this.r = cryptoUtils.randBetween(this.n, (this.n / bigintConversion.textToBigint("2")));
    //this.calculateR(n);
  }

  setE(e: bigint) {
    this.e = e;
  }
  setN(n: bigint) {
    this.n = n;
  }
  setR(r: bigint) {
    this.r = r;
  }
  encrypt(m: bigint) {
    return cryptoUtils.modPow(m, this.e, this.n);
  }

  verify(s: bigint) {
    return cryptoUtils.modPow(s, this.e, this.n);
  }

  blind(message: bigint) {
    //Here we have the blind message
    // blindMessage = (message * Math.pow(r, this.e)) % this.n;
    //return (message * Math.pow(r, this.e)) % this.n;
    //base = message

    return (message * cryptoUtils.modPow(this.r, this.e, this.n));
  }
  unblind(blindSignedMessage: bigint) {
    // signedMessage = (blindSigned * Math.pow(r, -1)) % this.n;
    // return signedMessage;

    return (blindSignedMessage * cryptoUtils.modInv(this.r, this.n));
  }

}

// async function calculateR(n: bigint, bitLength: number): bigint {
//   let r: bigint = 0n;
//   do {
//     r  = await cryptoUtils.prime(bitLength);
//   } while (cryptoUtils.bitLength(r) !== bitLength || r % n === 0n);

//   return r;

// }
