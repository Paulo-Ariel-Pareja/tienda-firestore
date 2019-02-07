import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { AuthService } from "../auth/auth.service";
import { Cart } from "../models/cart";
import { Product } from "../models/product";
import { reject } from "q";

@Injectable({
  providedIn: "root"
})
export class CartService {
  constructor(public auth: AuthService, private afs: AngularFirestore) {}

  createCard(id) {
    this.afs
      .collection("carts")
      .doc(id)
      .set({ id: id, products: [], totalProducts: 0 });
  }

  myCart(uid) {
    return this.afs.doc<Cart>(`carts/${uid}`).snapshotChanges();
  }

  myCartRef(uid) {
    return this.afs.collection<Cart>("carts").doc(uid).ref;
  }

  addProduct(product): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.user.subscribe(data => {
        if (data) {
          const ref = this.myCartRef(data.uid);
          ref.get().then(doc => {
            let cartData = doc.data();
            let productsInCart = cartData.products;
            const productToCart = {
              id: product.uid,
              name: product.name,
              qty: 1,
              price: product.price
            };
            const exist = CartService.findProductByKey(
              productsInCart,
              "id",
              product.uid
            );
            if (!exist) {
              productsInCart.push(productToCart);
              cartData.totalProducts += 1;
            } else {
              exist.qty += 1;
              cartData.totalProducts += 1;
            }

            return ref
              .update(cartData)
              .then(() => {
                resolve(true);
              })
              .catch(err => {
                reject(err);
              });
          });
        }
      });
    });
  }

  static findProductByKey(array, key, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
    return null;
  }

  static totalProductsInCart(products: Product[]) {
    let sum = 0;
    for (let i = 0; i < products.length; i++) {
      sum += parseInt(products[i]["qty"]);
    }
    return sum;
  }

  updateProduct(product, qty, uid): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.myCartRef(uid);
      ref.get().then(doc => {
        let cartData = doc.data();
        let productsInCart = cartData.products;
        const exist = CartService.findProductByKey(
          productsInCart,
          "id",
          product.id
        );
        if (exist) {
          if (exist.qty != qty) {
            exist.qty = qty;
            cartData.totalProducts = CartService.totalProductsInCart(cartData.products)
          }
          return ref
            .update(cartData)
            .then(() => {
              resolve(true);
            })
            .catch(err => {
              reject(err);
            });
        }
      });
    });
  }

  removeProduct(product, uid): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.myCartRef(uid);
      ref.get().then(doc => {
        let cartData = doc.data();
        let productsInCart = cartData.products;
        let totalQty = cartData.totalProducts;
        cartData.totalProducts = parseInt(totalQty) - parseInt(product.qty);
        const exist = CartService.findProductByKey(
          productsInCart,
          "id",
          product.id
        );
        if (exist) {
          const index = productsInCart.findIndex(obj => obj.id === product.id);
          cartData.products = [
            ...productsInCart.slice(0, index),
            ...productsInCart.slice(index + 1)
          ];
          return ref
            .update(cartData)
            .then(() => {
              resolve(true);
            })
            .catch(err => {
              reject(err);
            });
        }
      });
    });
  }

  totalPrice(products: Product[]): number{
    let total = 0;
    for(let i = 0; i < products.length; i++){
      total += products[i]['qty'] * products[i]['price'];
    }
    return total;
  }

  resetCart(uid): Promise<any>{
    const ref = this.myCartRef(uid);
    return ref.get().then(doc =>{
      let cartData = doc.data();
      cartData.products = [];
      cartData.totalProducts = 0;
      return ref.update(cartData);
    })
  }
}
