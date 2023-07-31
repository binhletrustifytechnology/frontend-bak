import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private dataSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  setData(data: number): void {
    this.dataSubject.next(data);
  }

  getData(): Observable<number> {
    return this.dataSubject.asObservable();
  }
}
