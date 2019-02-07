import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AngularFirestore } from "angularfire2/firestore";
import { Product } from "src/app/models/product";
import { SnackService } from "src/app/common/snack.service";
import { AuthService } from "src/app/auth/auth.service";
import { ProductsService } from "src/app/common/products.service";
import { map } from "rxjs/operators";
import { Upload } from "src/app/models/upload";
import { UploadService } from "../upload.service";

@Component({
  selector: "app-products-dialog",
  templateUrl: "./products-dialog.component.html",
  styleUrls: ["./products-dialog.component.css"]
})
export class ProductsDialogComponent {
  uploads;

  constructor(
    private aft: AngularFirestore,
    public dialogRef: MatDialogRef<ProductsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private snackService: SnackService,
    public auth: AuthService,
    private productService: ProductsService,
    private uploadService: UploadService
  ) {
    if (data.uid) {
      this.uploads = this.productService
        .product(this.data.uid)
        .collection("uploads")
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            })
          )
        );
    }
  }

  saveProduct() {
    if (this.data.uid) {
      this.productService
        .update(this.data)
        .then(() => {
          this.snackService.launch("Producto actualizado", "Tienda", 3000);
        })
        .catch(error => {
          this.snackService.launch("Error: " + error.message, "Tienda", 3000);
        });
    } else {
      this.productService
        .save(this.data)
        .then(() => {
          this.snackService.launch("Producto creado", "Tienda", 3000);
        })
        .catch(error => {
          this.snackService.launch("Error: " + error.message, "Tienda", 3000);
        });
    }
    this.dialogRef.close();
  }

  removeUpload(upload: Upload) {
    this.uploadService.removeFile(upload.id).then(() => {
      this.aft
        .doc(`products/${this.data.uid}/uploads/${upload.id}`)
        .delete()
        .then(() => {
          this.snackService.launch("Archivo adjunto eliminado", "Tienda", 3000);
        })
        .catch(error => {
          this.snackService.launch("Error: " + error.message, "Tienda", 3000);
        });
    });
  }
}
