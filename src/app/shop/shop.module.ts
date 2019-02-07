import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopProductsComponent } from './shop-products/shop-products.component';
import { SharedModule } from '../shared/shared.module';
import { SlickModule } from 'ngx-slick';
import { ShopProductComponent } from './shop-product/shop-product.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';

@NgModule({
  declarations: [ 
    ShopProductsComponent, 
    ShopProductComponent, CartComponent, OrdersComponent 
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    SharedModule,
    SlickModule.forRoot()
  ]
})
export class ShopModule { }
