import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CartService } from 'src/app/common/cart.service';
import { SnackService } from 'src/app/common/snack.service';
import { AppService } from 'src/app/common/app.service';
import { Product } from 'src/app/models/product';
import { Order } from 'src/app/models/order';
import { OrdersService } from 'src/app/common/orders.service';

declare const moment: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: any;
  totalPrice: number;
  uid: string;

  constructor(
    public auth: AuthService,
    public cartService: CartService,
    public snackService: SnackService,
    private router: Router,
    public appService: AppService,
    private orderService: OrdersService
  ) {
    this.auth.user.subscribe(user =>{
      if(user){
        this.cartService.myCart(user.uid).subscribe(cart =>{
          this.cart = cart.payload.data();
          this.totalPrice = this.cartService.totalPrice(this.cart.products);
          this.uid = user.uid;
        })
      }
    })
   }

   update(product: Product, qty){
    this.appService.fireLoader();
    this.cartService.updateProduct(product, qty.value, this.uid).then(() =>{
      this.snackService.launch('Producto actualizado', 'Carrito', 3000);
      this.appService.stopLoader();
    })
    .catch((err) =>{
      this.snackService.launch('Error actualizado el producto', 'Carrito', 3000);
      this.appService.stopLoader();
    });
   }

   remove(product: Product){
    this.appService.fireLoader();
    this.cartService.removeProduct(product, this.uid).then(() =>{
      this.snackService.launch('Producto eliminado', 'Carrito', 3000);
      this.appService.stopLoader();
    })
    .catch((err) =>{
      this.snackService.launch('Error eliminando el producto', 'Carrito', 3000);
      this.appService.stopLoader();
    });
   }

  ngOnInit() {
  }

  processOrder(){
    let order: Order = {
      id: null,
      uid: this.uid,
      products: this.cart.products,
      amount: this.cartService.totalPrice(this.cart.products),
      totalProducts: this.cart.totalProducts,
      create_at: moment(new Date).format('DD/MM/YYYY')
    };
  
    this.orderService.save(order).then(() =>{
      this.cartService.resetCart(this.uid).then(() =>{
        this.snackService.launch('Pedido generado correctamente', 'Cart', 3000);
        this.router.navigate(['/orders']);
      })
    })

  }

}
