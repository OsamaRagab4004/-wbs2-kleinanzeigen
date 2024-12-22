import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminComponent } from './admin/admin.component';
import { UsersListComponent } from './admin/users-list/users-list.component';
import { CategoriesComponent } from './categories/categories.component';
import { IsSessionInvalidGuard } from './guards/is-session-invalid.guard';
import { IsSessionValidGuard } from './guards/is-session-valid.guard';
import { NutzertypGuard } from './guards/nutzertyp.guard';
import { ImpressumComponent } from './impressum/impressum.component';
import { KaeuferComponent } from './kaeufer/kaeufer.component';
import { LoginComponent } from './login/login.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { ProductsComponent } from './products/products.component';
import { RegisterComponent } from './register/register.component';
import { UnregisteredUserPanelComponent } from './unregistered-user-panel/unregistered-user-panel.component';
import { VerkaeuferPanelComponent } from './verkaeufer-panel/verkaeufer-panel.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [IsSessionInvalidGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [IsSessionInvalidGuard],
  },
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', component: CategoriesComponent },
  { path: 'admin', redirectTo: 'admin/sellers-list', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [IsSessionValidGuard, NutzertypGuard],
    children: [
      {
        path: 'sellers-list',
        component: UsersListComponent,
        data: { editNutzertyp: 'VERKAEUFER' },
      },
      {
        path: 'users-list',
        component: UsersListComponent,
        data: { editNutzertyp: 'KAEUFER' },
      },
    ],
    data: { sessionNutzertyp: 'ADMIN' },
  },
  {
    path: 'edit-product/:produktId',
    pathMatch: 'full',
    component: AddProductComponent,
  },
  { path: 'add-product', component: AddProductComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product-info', component: ProductInfoComponent },
  {
    path: 'kaeufer',
    component: KaeuferComponent,
    canActivate: [IsSessionValidGuard, NutzertypGuard],
    data: { sessionNutzertyp: 'KAEUFER' },
  },
  {
    path: 'verkaeufer',
    component: VerkaeuferPanelComponent,
    canActivate: [IsSessionValidGuard, NutzertypGuard],
    data: { sessionNutzertyp: 'VERKAEUFER' },
  },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'user-panel', component: UnregisteredUserPanelComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
