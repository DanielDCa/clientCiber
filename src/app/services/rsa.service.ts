import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as cryptoUtils from 'bigint-crypto-utils';
import * as bigintConversion from 'bigint-conversion';


@Injectable({
  providedIn: 'root'
})
export class RsaService {


  URI= 'http://localhost:3000';
  constructor(private http : HttpClient) { }

  async getPublicKey(){

    //Subcribe works as promise, this method waits until the request finish
    this.http.get(`${this.URI}/publickey`).subscribe((async (data:any) =>{
      let e = bigintConversion.hexToBigint(data.publicKey.e);
      let n = bigintConversion.hexToBigint(data.publicKey.n);
      console.log(e);
      console.log(n);

      this.sendEncryptedMessage(e, n, 80n);
    }));
  }

  sendEncryptedMessage(e: bigint, n: bigint, m: bigint){
    var encryptedMessage = cryptoUtils.modPow(m,e,n);
    var encryptedMessageHex = bigintConversion.bigintToHex(encryptedMessage);

    this.http.put(`${this.URI}/sendmessage`,{encryptedMessageHex}).subscribe((data: any) =>{
      console.log(data);
    });
  }

}
