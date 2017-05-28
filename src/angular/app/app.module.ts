import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { Organelle } from "../euglena/organelle.webui.angular";
import { Euglena } from "../euglena/index";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [Organelle, Euglena],
  bootstrap: [AppComponent]
})
export class AppModule { }
