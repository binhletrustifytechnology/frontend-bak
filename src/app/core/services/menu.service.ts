import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {MenuSection} from "./menu.models";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  currentMenuSections: Array<MenuSection> = [];
  menuSections$: Subject<Array<MenuSection>> = new BehaviorSubject<Array<MenuSection>>([]);

  constructor() {
    this.buildMenu();
  }


  private buildMenu() {
    this.currentMenuSections = this.buildTenantAdminMenu();

    this.menuSections$.next(this.currentMenuSections);
  }

  private buildTenantAdminMenu(): Array<MenuSection> {
    const sections: Array<MenuSection> = [];
    sections.push(
      {
        id: 'home',
        name: 'home.home',
        type: 'link',
        path: '/',
        icon: 'home',
        enableSubTenant: true
      },
      {
        id: 'dashboard',
        name: 'dashboard.dashboard',
        type: 'link',
        path: '/dashboard3',
        icon: 'dashboard',
        enableSubTenant: true
      },
      {
        id: 'device',
        name: 'device.devices',
        type: 'link',
        path: '/devices',
        icon: 'devices',
        enableSubTenant: true,
        // pages: [
        //   {
        //     id: 'devices',
        //     name: 'device.devices',
        //     type: 'link',
        //     path: '/entities/devices',
        //     icon: 'devices_other'
        //   },
        //   {
        //     id: 'assets',
        //     name: 'asset.assets',
        //     type: 'link',
        //     path: '/entities/assets',
        //     icon: 'domain'
        //   }
        // ]
      },
    );
    return sections;
  }

  public menuSection(): Observable<Array<MenuSection>> {
    return this.menuSections$;
  }

}
