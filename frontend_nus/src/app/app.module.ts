import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AuthComponent } from './components/auth/auth.component';
import { CartComponent } from './components/cart/cart.component';

import { ProductService } from './services/product/product.service';
import { FormsModule } from '@angular/forms';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductAddComponent } from './components/product-add/product-add.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ErrorComponent } from './components/error/error.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { SellerProductListComponent } from './components/seller-product-list/seller-product-list.component';

// order of routes is important coz first match wins(start from more specific to generic)
const routes: Routes = [
  {path: 'index', component: HomeComponent},
  {path: 'products', component: ProductListComponent},
  {path: 'products/:pdtid', component: ProductDetailsComponent},
  {path: 'products/catid/:catid/:categoryname', component: ProductListComponent},
  {path: 'cart', component: CartComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'order-history', component: OrderHistoryComponent},
  {path: 'order-details/:orderId', component: OrderDetailsComponent},
  {path: 'error', component: ErrorComponent},
  {path: 'addproduct', component: ProductAddComponent},
  {path: 'check-products', component: SellerProductListComponent},
  {path: '', redirectTo: '/index', pathMatch: 'full'},
  {path: '**', redirectTo: '/error', pathMatch: 'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductListComponent,
    ProductDetailsComponent,
    AuthComponent,
    CartComponent,
    CartDetailsComponent,
    CheckoutComponent,
    ProductCategoryMenuComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    OrderHistoryComponent,
    ErrorComponent,
    OrderDetailsComponent,
    ProductAddComponent,
    SellerProductListComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule, //to access rest api
    AppRoutingModule,
    ReactiveFormsModule, // Add ReactiveFormsModule
    FormsModule,
    BrowserAnimationsModule,  // Required for Angular Material
    MatDialogModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
