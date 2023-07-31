import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ActiveComponentService {

  private activeComponent: any;
  private activeComponentChangedSubject: Subject<any> = new Subject<any>();

  public getCurrentActiveComponent(): any {
    return this.activeComponent;
  }

  public setCurrentActiveComponent(component: any): void {
    this.activeComponent = component;
    this.activeComponentChangedSubject.next(component);
  }
}
