import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {DevicesService} from "@core/services/devices.service";
import {DevicesDataSource} from "@modules/home/components/device/device.datasource";
import {Device} from "@modules/home/components/device/device.model";
import {catchError, finalize, tap, throwError} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'tb-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DeviceComponent implements OnInit {

  dataSource: DevicesDataSource;
  devices: Device[] = [];
  loading = false;
  displayedColumns= ["id", "name", "slcDeviceAddress", "location"];

  constructor(
    private devicesService: DevicesService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // this.dataSource = new DevicesDataSource(this.devicesService);
    // this.dataSource.loadDevices(1);

    this.loadDevicesPage();
  }

  private loadDevicesPage() {
    this.loading = true;
    this.devicesService.findAllDevices()
      .pipe(
        tap(devices => this.devices = devices),
        catchError(err => {
          console.log("Error loading lessons", err);
          alert("Error loading lessons.");
          return throwError(err);
        }),
        finalize(() => this.loading = false)
      ).subscribe(devices => console.log(this.devices.length));
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
    this.router.navigate(['/devices', row.id]);
  }

}
