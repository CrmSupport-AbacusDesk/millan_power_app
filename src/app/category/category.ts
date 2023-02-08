import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, InfiniteScroll } from 'ionic-angular';

import { DbserviceProvider } from '../../providers/dbservice/dbservice';
// import { errorHandler } from '@angular/platform-browser/src/browser';
// import { ProductDetailPage } from '../product-detail/product-detail';


import { ProductDetailPage } from '../../pages/product-detail/product-detail';


// import { NewarrivalsPage } from '../newarrivals/newarrivals';
// import { SubCategoryPage } from '../sub-category/sub-category';
// import { ProductsPage } from '../../pages/products/products';


import { SubCategoryPage } from '../sub-category/sub-category';

import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { ConstantProvider } from '../../providers/constant/constant';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  prod_cat_list:any=[];
  filter :any = {};
  flag:any='';
  loading:Loading;
  cat_images:any=[];
  category_count:any='';
  no_rec:any=false;
  skelton:any={}
  sklton:any='';
  url:any;  

  uploadUrl:any='';
  // url:any='https://apps.abacusdesk.com/grafdoer/dd_api/app/Http/Controllers/Admin/Master/appOfflineUploads/imageCatalogue/'
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app:App, public constant:ConstantProvider) {
    this.skelton = new Array(10);

    this.uploadUrl = this.constant.upload_url;

    this.url=this.service.category_url;
    console.log(this.url);
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SubCategoryPageModule');
    this.presentLoading();
    this.getProductCategoryList('');
  }
  ionViewWillEnter()
  {
    
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getProductCategoryList('');
    this.flag='';
    refresher.complete();
  }
  goToNewArrivals()
  {
    console.log('newArrivals')
    this.navCtrl.push(NewarrivalsPage);
  }
  SubCategoryPageModule(name){
    this.presentLoading2();
    this.filter.limit = 0;
    this.filter.name = name;
    this.service.post_rqst({'filter' : this.filter},'app_master/checkCategoryLength')
    .subscribe((r)=>
    {
      console.log(r);
      this.loading.dismiss();
      if(r['categories'].length == 1)
      {
        console.log('list length is one');
        this.navCtrl.push(SubCategoryPage,{'id':r['categories'][0].id})
    
      }
      else{
        console.log('list length is two');

        this.navCtrl.push(SubCategoryPage,{'name':name})
      }
    },(error: any) => {
      this.loading.dismiss();
    })

  }

  loadData(InfiniteScroll) {
    

    console.log('catagorylist');
    this.filter.limit =this.prod_cat_list.length;

    console.log("length is =====>",this.prod_cat_list.length)
    this.service.post_rqst({'filter' : this.filter},'app_master/parentCategory_List')
    .subscribe((r) =>
    {
     
      if(r['categories']=='')
      {
        this.flag=1;
      }
      else{
        setTimeout(() => {
          // this.prod_cat_list=r['category'];
          this.prod_cat_list=this.prod_cat_list.concat(r['category'])
          InfiniteScroll.complete();
        
        // for (let index = this.prod_cat_list.length; index < 7; index++) {
        //             this.prod_cat_list.push(this.prod_cat_list.length)
            
        //   }
    
        }, 500);
      }
     
  
    },(error: any) => {
      this.loading.dismiss();
    }
    );

    
  }
 
  // getCategoryImages(categoryId,index)
  // {
  //   console.log(categoryId)
 
  // this.service.post_rqst({'categoryid':categoryId},'app_master/getcategoryImage').subscribe((res)=>
  // {
  //   console.log(res)
  
  //   this.prod_cat_list[index]['image'] = res['categories'][0]['image']
  // })
  // }
  
  // loadData(infiniteScroll)
  // {
  //   console.log('loading');
    
  //   this.filter.limit=this.prod_cat_list.length;
  //   this.service.post_rqst({'filter' : this.filter},'app_master/parentCategoryList').subscribe( r =>
  //     {
  //       console.log(r);
  //       if(r['categories']=='')
  //       {
  //         this.flag=1;
  //       }
  //       else
  //       {
  //         setTimeout(()=>{
  //           for (let index = this.prod_cat_list.length; index < r['categories'].length; index++) {
  //             console.log(r['categories'][index])
  //             this.getCategoryImages(r['categories'][index]['main_category'],index)
  //           }
  //           this.prod_cat_list=this.prod_cat_list.concat(r['categories']);
  //           console.log('Asyn operation has stop')
  //           infiniteScroll.complete();
  //         },1000);
  //       }
  //     });
  //   }


    presentLoading() 
    {
      // this.loading = this.loadingCtrl.create({
      //   content: "Please wait...",
      //   dismissOnPageChange: false
      // });
      // this.loading.present();
    }
    presentLoading2() 
    {
      this.loading = this.loadingCtrl.create({
        content: "",
        dismissOnPageChange: false
      });
      this.loading.present();
    }
    ionViewDidLeave()
    {
      let nav = this.app.getActiveNav();
      if(nav && nav.getActive()) 
      {
        let activeView = nav.getActive().name;
        let previuosView = '';
        if(nav.getPrevious() && nav.getPrevious().name)
        {
          previuosView = nav.getPrevious().name;
        }  
        console.log(previuosView); 
        console.log(activeView);  
        console.log('its leaving');
        if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) 
        {
          
          console.log(previuosView);
          this.navCtrl.popToRoot();
        }
      }
    }

   
    
    getProductCategoryList(search)
    {
      this.presentLoading2();
      console.log('catagorylist');
      this.filter.limit = 0;
      this.filter.search=search;
      this.service.post_rqst({'filter' : this.filter},'app_master/parentCategory_List')
      .subscribe((r) =>
      {
        // this.loading.dismiss();
        console.log(r);
      this.loading.dismiss();
        this.prod_cat_list=r['category'];
        console.log(this.prod_cat_list);
        // console.log( this.prod_cat_list.length);
        
        
  
        for (let index = 0; index < this.prod_cat_list.length; index++) {
                   this.sklton = this.prod_cat_list[index]

                   console.log("this.sklton ======>",this.prod_cat_list.length );
                   console.log("this.sklton.main_category",this.prod_cat_list.main_category);
                
                   
          this.prod_cat_list.length
          
          
        }
      },(error: any) => {
        // this.loading.dismiss();
      }
      );
      
    }

  }
  