import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { FashionListComponent } from './components/fashion-list/fashion-list.component';
import { FashionFormComponent } from './components/fashion-form/fashion-form.component';

@NgModule({
  declarations: [
    AppComponent,
    FashionListComponent,
    FashionFormComponent
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
