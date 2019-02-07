import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SnackService } from 'src/app/common/snack.service';
import { AppService } from 'src/app/common/app.service';

export class Auth {
  constructor(
    public email: string,
    public password: string
  ){}
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    public auth: AuthService,
    public router: Router,
    private snackService: SnackService,
    public appService: AppService
  ) { }

  login(user: Auth){
    this.appService.fireLoader();
    this.auth.emailAndPassword(user.email, user.password).then(credenciales =>{
      this.router.navigate(['/shop']).then(()=> {
        this.appService.stopLoader();
      }).catch(err=>{
        this.snackService.launch("Error: " + err.message, "Inicio de sesion", 3000);
        this.appService.stopLoader();
      });
    }).catch(err=>{
      this.snackService.launch("Error: " + err.message, "Inicio de sesion", 3000);
      this.appService.stopLoader();
    })
  }

}
