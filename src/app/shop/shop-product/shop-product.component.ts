import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ProductsService } from 'src/app/common/products.service';
import { CartService } from 'src/app/common/cart.service';
import { Upload } from 'src/app/models/upload';


@Component({
  selector: 'app-shop-product',
  templateUrl: './shop-product.component.html',
  styleUrls: ['./shop-product.component.css']
})
export class ShopProductComponent implements OnInit {

  public product: any;
  public slides = [];
  public slideConfig = {"slidesToShow": 2, "slidesToScroll": 2};

  constructor(
    private route: ActivatedRoute,
    public productService: ProductsService,
    public auth: AuthService,
    public cartService: CartService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    const product = this.productService.product(id);
    product.collection('uploads').valueChanges().subscribe(uploadSnap => {
      uploadSnap.map((upload: Upload) => {
        this.slides.push({ img: upload.url});
      })
    })
    this.product = product.valueChanges();
  }

  ngOnInit() {
  }

}
