import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {BehaviorSubject, catchError, finalize, Observable, of} from "rxjs";
import {DevicesService} from "@core/services/devices.service";
import {Device} from "@modules/home/components/device/device.model";

export class DevicesDataSource implements DataSource<Device> {

  private devicesSubject = new BehaviorSubject<Device[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  devices: Device[] = [];

  public loading$ = this.loadingSubject.asObservable();

  constructor(private devicesService: DevicesService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Device[]> {
    return this.devicesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.devicesSubject.complete();
    this.loadingSubject.complete();
  }

  loadDevices(courseId: number, filter = '',
              sortDirection = 'asc', pageIndex = 0, pageSize = 3) {

    this.loadingSubject.next(true);

    this.devicesService.findAllDevices()
      .subscribe(devices => {
        this.devicesSubject.next(devices);
        this.devices = devices;
      });

    // this.coursesService.findDevices(
    //   courseId,
    //   sortDirection,
    //   pageIndex,
    //   pageSize).pipe(
    //   catchError(() => of([])),
    //   finalize(() => this.loadingSubject.next(false))
    // ).subscribe(devices => this.devicesSubject.next(devices));
  }
}
