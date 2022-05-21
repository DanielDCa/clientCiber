import { RsaPublicKey } from './../models/rsaPublicKey';
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
  rsaPublicKey : RsaPublicKey = new RsaPublicKey(0n, 0n) ;

  async getPublicKey(){

    //Subcribe works as promise, this method waits until the request finish
    this.http.get(`${this.URI}/publickey`).subscribe((async (data:any) =>{
      let e = bigintConversion.hexToBigint(data.publicKey.e);
      let n = bigintConversion.hexToBigint(data.publicKey.n);
      this.rsaPublicKey.setE(e);
      this.rsaPublicKey.setN(n);
      this.rsaPublicKey.setR(cryptoUtils.randBetween(n, n / bigintConversion.textToBigint("2")));
      console.log(e);
      console.log(n);

      this.sendEncryptedMessage(80n);
    }));
  }

  sendEncryptedMessage( m: any){
    var encryptedMessage = this.rsaPublicKey.encrypt(m);
    var encryptedMessageHex = bigintConversion.bigintToHex(encryptedMessage);

    this.http.post<any>(`${this.URI}/decrypt`,{encryptedMessageHex}).subscribe((data: any) =>{
      console.log(data);
    });
  }

  signMessage(){
    var message = 80n;
    var messageHex = bigintConversion.bigintToHex(message);
    console.log("-----------------------------------------");

    this.http.post<any>(`${this.URI}/sign`,{messageHex}).subscribe((data: any) => {

      var signedMessage = bigintConversion.hexToBigint(data.signedMessage);
      if(message === this.rsaPublicKey.verify(signedMessage)){
        console.log("Mensaje verificado: Correcto");
      }
      else{
        console.log("Mensaje verificado: Incorrecto");
      }
    })
  }

  signBlindMessage(){

    var message = 80n;
    var blindMessage = this.rsaPublicKey.blind(message);
    var messageHex = bigintConversion.bigintToHex(blindMessage);

    console.log("-----------------------------------------");
    this.http.post<any>(`${this.URI}/sign`,{messageHex}).subscribe((data: any) => {

      var signedBlindMessage = bigintConversion.hexToBigint(data.signedMessage);
      var unblindSignedMessage = this.rsaPublicKey.unblind(signedBlindMessage);

      if(message === this.rsaPublicKey.verify(unblindSignedMessage)){
        console.log("Mensaje cegado: Correcto");
      }
      else{
        console.log("Mensaje cegado: Incorrecto");
      }

    })
  }
}
