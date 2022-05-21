import { Component } from '@angular/core';
import { RsaService } from './services/rsa.service';
import * as bigintConversion from 'bigint-conversion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public rsaService: RsaService){

  }
  title = 'encryptClient';

  ngOnInit(){
    //this.rsaService.sendEncryptedMessage(e,n,m);
  }
  goEncryptMessage (){
    var e = 1n;
    var n = 1n;
    this.rsaService.getPublicKey();

    // this.rsaService.sendEncryptedMessage(e,n,80n).subscribe((data: any) =>{
    //   console.log(data);
    // });
  }
  goSignMessage (){

    this.rsaService.signMessage();

    // this.rsaService.sendEncryptedMessage(e,n,80n).subscribe((data: any) =>{
    //   console.log(data);
    // });
  }
  goBlindSignMessage(){
    this.rsaService.signBlindMessage();
  }
}
