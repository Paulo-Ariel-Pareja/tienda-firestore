import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatTableDataSource } from '@angular/material';
import { ProductsService } from 'src/app/common/products.service';
import { SnackService } from 'src/app/common/snack.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Product } from 'src/app/models/product';
import { ProductsDialogComponent } from '../products-dialog/products-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent  {

  displayedColumns = ['name', 'price', 'description', 'edit', 'delete'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productService: ProductsService,
    public dialog: MatDialog,
    private snackService: SnackService,
    public auth: AuthService
  ) { 
    this.productService.products().valueChanges().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    },
    err => {
      this.snackService.launch("Error obteniendo productos: " + err.message, "Productos", 5000);
    })
  }

  applyFilter(event: any){
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  trackById(index, product: Product){
    return product.uid;
  }

  openDialog(product: Product){
    this.dialog.open(ProductsDialogComponent, ProductsComponent.dialogConfig(product));
  }

  addProduct(){
    let product: Product = new Product;
    this.dialog.open(ProductsDialogComponent, ProductsComponent.dialogConfig(product));
  }

  private static dialogConfig(data): MatDialogConfig{
    const config: MatDialogConfig = new MatDialogConfig;
    config.width = '700px';
    config.data = data;
    return config;
  }

  remove(product: Product){
    this.productService.remove(product.uid).then(()=>{
      this.snackService.launch('Producto eliminado correctamente', 'Productos', 3000);
    })
  }
}
