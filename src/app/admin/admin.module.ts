import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProductsDialogComponent } from './products-dialog/products-dialog.component';
import { AdminComponent } from './admin/admin.component';
import { ProductsComponent } from './products/products.component';
import { UploadService } from './upload.service';
import { UploadFormComponent } from './upload-form/upload-form.component';

@NgModule({
  declarations: [
    AdminComponent,
    ProductsDialogComponent,
    ProductsComponent,
    UploadFormComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  providers: [
    UploadService
  ],
  exports: [
   
  ],
  entryComponents: [
    ProductsDialogComponent
  ]
})
export class AdminModule { }
