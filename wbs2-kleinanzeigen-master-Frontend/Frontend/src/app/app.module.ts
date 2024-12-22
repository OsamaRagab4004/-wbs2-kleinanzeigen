import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageSliderModule } from 'ng-image-slider';
import { CookieService } from 'ngx-cookie-service';
import { RangeSliderModule } from 'ngx-range-slider';
import { Socket } from 'ngx-socket-io';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminComponent } from './admin/admin.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesComponent } from './categories/categories.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { KaeuferComponent } from './kaeufer/kaeufer.component';
import { LoginComponent } from './login/login.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { MiniChatComponent } from './product-info/mini-chat/mini-chat.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { ProductsComponent } from './products/products.component';
import { RegisterComponent } from './register/register.component';
import { ChatComponent } from './shared/chat/chat.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { ResetPassComponent } from './shared/reset-pass-user/reset-pass.component';
import { ResetUsernameComponent } from './shared/reset-username-user/reset-username.component';
import { VerkaeuferCardComponent } from './verkaeufer-card/verkaeufer-card.component';
import { VerkaeuferPanelComponent } from './verkaeufer-panel/verkaeufer-panel.component';

import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ToastrModule } from 'ngx-toastr';
import { EditUserDataComponent } from './shared/edit-user-data/edit-user-data.component';
import { UnregisteredUserPanelComponent } from './unregistered-user-panel/unregistered-user-panel.component';
@Injectable()
export class MessageSocket extends Socket {
  constructor() {
    super({ url: 'http://localhost:3000', options: { withCredentials: true } });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    AdminComponent,
    AddProductComponent,
    ProductsComponent,
    ProductInfoComponent,
    MiniChatComponent,
    KaeuferComponent,
    CategoriesComponent,
    VerkaeuferPanelComponent,
    ResetPassComponent,
    ResetUsernameComponent,
    UsersListComponent,
    ImpressumComponent,
    EditUserComponent,
    ChatComponent,
    ProductCardComponent,
    VerkaeuferCardComponent,
    UnregisteredUserPanelComponent,
    EditUserDataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgImageSliderModule,
    NgbModule,
    RangeSliderModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSliderModule,
  ],
  providers: [MessageSocket, CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
