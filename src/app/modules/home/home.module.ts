import {NgModule} from "@angular/core";
import {HomeComponent} from "./home.component";
import {CommonModule} from "@angular/common";
import {HomeRoutingModule} from "./home-routing.module";
import {SharedModule} from "@shared/shared.module";
import {MenuLinkComponent} from "./menu/menu-link.component";
import {SidenavComponent} from "@modules/home/menu/sidenav.component";

@NgModule({
  declarations: [
    HomeComponent,
    MenuLinkComponent,
    SidenavComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule
  ],
  exports: []
})
export class HomeModule {
}
