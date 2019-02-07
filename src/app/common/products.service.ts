import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "angularfire2/firestore";
import * as faker from 'faker';
import { Product } from '../models/product';
import { UploadService } from '../admin/upload.service';
import { Upload } from '../models/upload';

type productsCollection = AngularFirestoreCollection<Product[]>;
type productDocument = AngularFirestoreDocument<Product>;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private afs: AngularFirestore,
    private uploadService: UploadService
  ) { }

  products(): productsCollection{
    return this.afs.collection<Product[]>('products');
  }

  product(id: string): productDocument{
    return this.afs.doc<Product>(`products/${id}`);
  }

  save(product: Product): Promise<any>{
    product.uid = faker.random.alphaNumeric(16);
    return this.products().doc(product.uid).set(Object.assign({}, product));
  }

  update(product: Product): Promise<any>{
    return this.product(product.uid).update(Object.assign({}, product));
  }

  getProductImages(productId: string){
    return this.afs.doc<Product>(`products/${productId}`).collection('uploads');
  }

  remove(id): Promise<any>{
    let ref = this.product(id);
    return new Promise((resolve, reject)=>{
      return ref.collection<Upload>('uploads').valueChanges().subscribe((files)=>{
        if(files){
          files.forEach((file: Upload) =>{
            this.uploadService.removeFile(file.id).then(() =>{
              this.afs.doc(`products/${id}/uploads/${file.id}`).delete();
            }).catch(err=>{})
          })
        }
        ref.delete().then(()=>{
          resolve(true);
        })
        .catch(err =>{
          reject(err);
        })
      })
    })
  }
  
}
