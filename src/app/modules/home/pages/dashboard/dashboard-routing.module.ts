import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "@modules/home/components/dashboard/dashboard.component";
import {Authority} from "@modules/home/pages/models/authority.enum";
import {Dashboard2Component} from "@modules/home/components/dashboard2/dashboard2.component";
import {Dashboard3Component} from "@modules/home/components/dashboard3/dashboard3.component";

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
      title: 'dashboard.dashboard',
      breadcrumb: {
        label: 'dashboard.dashboard',
        icon: 'mdi:dashboard-outline'
      },
      isPage: true,
    }
  },
  {
    path: 'dashboard2',
    component: Dashboard2Component,
    data: {
      auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
      title: 'dashboard.dashboard',
      breadcrumb: {
        label: 'dashboard.dashboard',
        icon: 'mdi:dashboard-outline'
      },
      isPage: true,
    }
  },
  {
    path: 'dashboard3',
    component: Dashboard3Component,
    data: {
      auth: [Authority.TENANT_ADMIN, Authority.CUSTOMER_USER],
      title: 'dashboard.dashboard',
      breadcrumb: {
        label: 'dashboard.dashboard',
        icon: 'mdi:dashboard-outline'
      },
      isPage: true,
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DashboardRoutingModule {}
