import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { FashionBrowseComponent } from './components/fashion-browse/fashion-browse.component';
import { FashionDetailComponent } from './components/fashion-detail/fashion-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    FashionBrowseComponent,
    FashionDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
