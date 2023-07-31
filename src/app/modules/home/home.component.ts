import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {WINDOW} from "../../core/services/window.service";
import {ActiveComponentService} from "@core/services/active-component.service";
import {RouterTabsComponent} from "@modules/home/components/router-tabs.component";
import {instanceOfSearchableComponent} from "@modules/home/models/searchable-component.model";
import {MenuService} from "@core/services/menu.service";
import {TranslateService} from "@ngx-translate/core";
import {CdkScrollable, ScrollDispatcher} from "@angular/cdk/overlay";
import {SharedDataService} from "@core/services/shared-data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'tt-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  logo = 'assets/trustify-technology-main-logo.png';
  sidenavMode: 'over' | 'push' | 'side' = 'side';
  forceFullscreen: boolean = true;
  searchEnabled: boolean = false;
  showSearch: boolean = false;
  activeComponent: any;

  hideLoadingBar = false;
  isOnTop = true;

  elementHeight: number;
  receivedValue: any;
  private dataSubscription: Subscription;

  constructor(
    // @Inject(WINDOW) private window: Window,
    private activeComponentService: ActiveComponentService,
    private sharedDataService: SharedDataService,
    private menuService: MenuService,
    private translate: TranslateService,
    private scrollDispatcher: ScrollDispatcher,
    private zone: NgZone
  ) {
    this.dataSubscription = this.sharedDataService.getData().subscribe((data) => {
      console.log('receivedValue', this.receivedValue)
      if (!data) return;
      this.receivedValue = data + 200;
      this.elementHeight = data + 200;
    });
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.scrollDispatcher.scrolled().subscribe((event: CdkScrollable) => {
      if(!event) return;

      const scroll = event.measureScrollOffset("top");
      let newIsOnTop = this.isOnTop;

      if (scroll > 0) {
        newIsOnTop = false
      } else {
        newIsOnTop = true;
      }

      if (newIsOnTop !== this.isOnTop) {
        this.zone.run(() => {
          this.isOnTop = newIsOnTop;
        });
      }
    });

    this.setElementHeight();

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    console.log('window:resize');
    this.setElementHeight();
  }

  displaySearchMode(): boolean {
    return this.searchEnabled && this.showSearch;
  }

  goBack() {
    // this.window.history.back();
  }

  private setElementHeight() {
    // Get the window's innerHeight (screen height excluding browser UI elements)
    const windowHeight = window.innerHeight;

    // You can also adjust the height value here if needed
    this.elementHeight = windowHeight - 50;
  }


  activeComponentChanged(activeComponent: any) {
    this.activeComponentService.setCurrentActiveComponent(activeComponent);
    if (!this.activeComponent) {
      setTimeout(() => {
        this.updateActiveComponent(activeComponent);
      });
    } else {
      this.updateActiveComponent(activeComponent);
    }
  }

  private updateActiveComponent(activeComponent: any) {
    this.showSearch = false;
    this.activeComponent = activeComponent;
    this.hideLoadingBar = activeComponent && activeComponent instanceof RouterTabsComponent;
    if (this.activeComponent && instanceOfSearchableComponent(this.activeComponent)) {
      this.searchEnabled = true;
    } else {
      this.searchEnabled = false;
    }
  }


  menuSection$ = this.menuService.menuSection();

  @Input() isExpanded: boolean = false;
  @Output() toggleMenu = new EventEmitter();

  // public routeLinks = [
  //   {link: "", name: "Home", icon: "home"},
  //   {link: "alarms", name: "Alarm", icon: "monitor"},
  // ];
}
