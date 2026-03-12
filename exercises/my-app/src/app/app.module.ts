import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FashionComponent } from './components/fashion/fashion.component';
import { FashionDetailComponent } from './components/fashion-detail/fashion-detail.component';
import { FashionNewComponent } from './components/fashion-new/fashion-new.component';
import { FashionEditComponent } from './components/fashion-edit/fashion-edit.component';
import { FashionAPIService } from './fashion-api.service';

@NgModule({
  declarations: [
    AppComponent,
    FashionComponent,
    FashionDetailComponent,
    FashionNewComponent,
    FashionEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [FashionAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
