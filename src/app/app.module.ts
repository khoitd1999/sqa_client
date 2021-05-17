import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MaterialgoodComponent } from './materialgood/materialgood.component';
import { PporderComponent } from './pporder/pporder.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialgoodUpdateComponent } from './materialgood/materialgood-update.component';
import { PporderUpdateComponent } from './pporder/pporder-update.component';

const appRoutes : Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'hang-hoa',
    component: MaterialgoodComponent
  },
  {
    path: 'hang-hoa/new',
    component: MaterialgoodUpdateComponent
  },
  {
    path: 'hang-hoa/:id/edit',
    component: MaterialgoodUpdateComponent
  },
  {
    path: 'don-hang',
    component: PporderComponent
  },
  {
    path: 'don-hang/new',
    component: PporderUpdateComponent
  },
  {
    path: 'don-hang/:id/edit',
    component: PporderUpdateComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PporderComponent,
    MaterialgoodComponent,
    MaterialgoodUpdateComponent,
    PporderUpdateComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
