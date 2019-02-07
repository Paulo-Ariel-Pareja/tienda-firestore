import { Component, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { OrdersService } from 'src/app/common/orders.service';
import { SnackService } from 'src/app/common/snack.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent  {

  displayedColumns = ['id', 'create_at', 'amount', 'totalProducts', 'detail'];
  datasource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private orderService: OrdersService,
    private snackService: SnackService,
    public auth: AuthService
  ) { 
    this.auth.user.subscribe(user =>{
      if(user){
        this.orderService.orders(user.uid).valueChanges().subscribe(
          data=>{
            this.datasource = new MatTableDataSource(data);
            this.datasource.sort = this.sort;
          },err => {
            this.snackService.launch('Error obteniendo datos: ' + err.message, 'Pedidos', 3000);
          }
        )
      }
    })
  }

  applyFilter(filterValue: string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  trackById(index, order: Order){
    return order.id;
  }
}
