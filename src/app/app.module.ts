import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {HomeModule} from "./modules/home/home.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CoreModule} from "./core/core.module";
import {MarkerMapService} from "@core/services/marker-map.service";
import {ScrollDispatcher} from "@angular/cdk/overlay";
import {ScrollingModule} from "@angular/cdk/scrolling";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    HomeModule,
    ScrollingModule
  ],
  providers: [
    ScrollDispatcher
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
