import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap } from 'rxjs/operators'; 
import * as firebase from "firebase";
import { User } from '../models/user';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;

  constructor(
              public afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router
    ) { 
    this.user = this.afAuth.authState.pipe(switchMap(user=>{
      if( user ){
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      }else{
        return of(null);
      }
    }));
  }

  private oAuthLogin(provider){
    return this.afAuth.auth.signInWithPopup(provider)
    .then(credenciales => {
      const user = credenciales.user;
      this.afs.collection<User>('users', ref => ref.where('email', "==", user.email)).valueChanges().subscribe(data =>{
        if(!data.length){
          const newUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL,
            role: 'customer'
          }
          this.afs.collection('users').doc(user.uid).set(newUser).then(() => {
            this.router.navigate(['/shop']);
            return;
          });
        }
        this.router.navigate(['/shop']);
      });
    });
  }

  googleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  emailAndPassword(email, password){
    return this.afAuth.auth.signInWithEmailAndPassword(email.value, password.value);
  }

  singUp(email, password){
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  signOut(){
    this.afAuth.auth.signOut().then(()=>{
      this.router.navigate(['/login']);
    });
  }
}
