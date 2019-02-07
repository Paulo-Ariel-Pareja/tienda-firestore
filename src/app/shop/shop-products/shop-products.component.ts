import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/combineLatest';
import { map } from 'rxjs/operators'
import { ProductsService } from 'src/app/common/products.service';
import { CartService } from 'src/app/common/cart.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AppService } from 'src/app/common/app.service';
import { SnackService } from 'src/app/common/snack.service';
import { Upload } from 'src/app/models/upload';
import { Product } from 'src/app/models/product';


@Component({
  selector: 'app-shop-products',
  templateUrl: './shop-products.component.html',
  styleUrls: ['./shop-products.component.css']
})
export class ShopProductsComponent implements OnInit {

  public products: any;

  constructor(
    private productService: ProductsService,
    public auth: AuthService,
    public cartService: CartService,
    public appService: AppService,
    public snackService: SnackService
  ) { }

  ngOnInit() {
    this.products = this.productService.products().snapshotChanges().pipe(map(productSnapshot => {
      return productSnapshot.map(product => {
        const productData = product.payload.doc.data();
        const productId = product.payload.doc.id;
        return this.productService.getProductImages(productId).snapshotChanges().pipe(map(uploadSnap => {
          let number = 0;
          return uploadSnap.map(upload => {
            if(number == 0){
              number++;
              return upload.payload.doc.data();
            }
          })
        }))
        .pipe(map(uploads => {
          return { productId, ...productData, uploads: uploads }
        }))
      })
    }))
    .flatMap(products  => Observable.combineLatest(products));
  }

  addProduct(product: Product){
    this.cartService.addProduct(product).then(() =>{
      this.snackService.launch('Producto agregado', 'Productos', 3000);
    })
    .catch((err) => {
      this.snackService.launch('Error :' + err.message, 'Productos', 3000);
    });
  }
}
