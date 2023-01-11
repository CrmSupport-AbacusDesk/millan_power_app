import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { CancelpolicyModalPage } from '../cancelpolicy-modal/cancelpolicy-modal';
import { GiftListPage } from '../gift-gallery/gift-list/gift-list';

/**
* Generated class for the RedeemTypePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-redeem-type',
  templateUrl: 'redeem-type.html',
})
export class RedeemTypePage {
  
  walletBal:any;
  data:any={};
  cashLimit:any ={};
  formData= new FormData();
  redeem_point:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController,  public modalCtrl: ModalController, public service:DbserviceProvider) {
    console.log(navParams);
    this.limit()
    
    this.walletBal = navParams.data.balance_point;
    this.redeem_point = navParams.data.redeem_point;
    this.karigar_detail = navParams.data.Status;
    console.log(this.karigar_detail);
    


  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RedeemTypePage');
  }

  limit()
    {
      this.service.post_rqst({},'app_karigar/cash_limit').subscribe( (r) =>{ 
        console.log(r);
        this.cashLimit = r.limit
        console.log(this.cashLimit);
        
      });
    }
  
  
  showAlert(text) {
    let alert = this.alertCtrl.create({
      title:'Alert!',
      cssClass:'action-close',
      subTitle: text,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text:'OK',
        cssClass: 'close-action-sheet',
        handler:()=>{
          // this.navCtrl.push(TransactionPage);
        }
      }]
    });
    alert.present();
  }

  alert(){
    let alert = this.alertCtrl.create({
        title:'Sorry!',
        cssClass:'action-close status-alert',
        subTitle:"Your current profile status is not <strong class=Approved>“Verified”</strong>.To know more, you can call us at <a href=tel:7558836538>7558836538</a>.",
        buttons: [
            {
                text: 'Okay',
                handler: () => {
                }
            }
        ]
    });
    alert.present();
}
  
karigar_detail:any ={}

  submit(){
    
   console.log(this.karigar_detail);
   
    console.log(this.data.redeem_type);
    if(!this.data.redeem_type){
      this.showAlert('Please select request Type');
      return
    }
    else if(this.data.redeem_type == 'Cash'){
      if(!this.data.redeem_amount){
        this.showAlert('Please fill redeem cash value');
        return
      }
      else if(this.data.redeem_amount > this.redeem_point){
        this.showAlert( 'insufficient points to redeem');
        return
      }

      else if(this.data.redeem_amount < this.cashLimit){
        this.showAlert( 'You must have at least ' + this.cashLimit + ' points in your wallet to redeem cash');
        return
      }

      let contactModal = this.modalCtrl.create(CancelpolicyModalPage,{'karigar_id':this.service.karigar_id, 'redeem_type':this.data.redeem_type, 'redeem_point':this.data.redeem_amount});
      contactModal.present();
      console.log('otp');
    }

    else if (this.data.redeem_type == 'gift'){
      this.navCtrl.push(GiftListPage,{'redeem_type_data':this.data})
    }
  }
}
