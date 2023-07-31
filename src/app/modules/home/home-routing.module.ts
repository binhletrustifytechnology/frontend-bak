import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'home.home',
      breadcrumb: {
        skip: true
      },
    },
    loadChildren: () => import('./pages/home-pages.module').then(m => m.HomePagesModule)
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
