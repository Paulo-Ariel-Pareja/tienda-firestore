import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SnackService } from 'src/app/common/snack.service';
import { JsonPipe } from '@angular/common';
import { AppService } from 'src/app/common/app.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public snackService: SnackService,
    public afs: AngularFirestore,
    private title: Title,
    private router: Router,
    private appService: AppService    
  ) { }

  ngOnInit() {
    this.title.setTitle('Registro');
  }

  signUp(user){
    this.appService.fireLoader();

    this.auth.singUp(user.email.value, user.password.value).then((value) =>{
      const userJson = value.user
      this.snackService.launch('Registro correcto, iniciando sesion', 'Alta usuario', 5000);

      const data = {
        uid: userJson.uid,
        email: userJson.email,
        displayName: userJson.email,
        photoUrl: null,
        role: 'customer'
      }

      this.afs.collection('users').doc(userJson.uid).set(data)

      .then(()=>{
        this.appService.stopLoader();
        this.auth.emailAndPassword(user.email, user.password).then(()=>{
          this.router.navigate(['/shop']);
        })
      }).catch(error => {
        this.appService.stopLoader();
        this.snackService.launch('Error: ' + error.message, 'Error en alta usuario', 5000);
      })
    }).catch(err => {
      this.appService.stopLoader();
      this.snackService.launch('Error: ' + err.message, 'Error en alta usuario', 5000);
    })
  }

}
