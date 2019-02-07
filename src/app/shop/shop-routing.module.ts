import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopProductsComponent } from './shop-products/shop-products.component';
import { ShopProductComponent } from './shop-product/shop-product.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { CustomerGuard } from '../auth/customer.guard';

const routes: Routes = [
  {path: 'shop', component: ShopProductsComponent},
  {path: 'cart', component: CartComponent, canActivate: [CustomerGuard]},
  {path: 'orders', component: OrdersComponent, canActivate: [CustomerGuard]},
  {path: 'product/:id', component: ShopProductComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
