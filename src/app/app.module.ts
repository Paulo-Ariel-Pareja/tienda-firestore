import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule, FirestoreSettingsToken } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { NavigationComponent } from './common/navigation/navigation.component';
import { AdminModule } from './admin/admin.module';
import { ShopModule } from './shop/shop.module';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    SharedModule,
    AuthModule,
    AdminModule,
    ShopModule
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
