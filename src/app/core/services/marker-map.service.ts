import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import * as L from 'leaflet';
import {PopUpService} from "@core/services/popup.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MarkerMapService {
  capitals: string = '/assets/data/usa-capitals.geojson';
  lightRadar: string = '/assets/data/lightRadar.json';
  listDevices: string = '/assets/data/listDevices.json';

  observer = new Subject();
  public subscriber$ = this.observer.asObservable();

  constructor(
    private http: HttpClient,
    private popupService: PopUpService
  ) {
  }

  static scaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }

  makeCapitalCircleMarkers(map: L.map, markersLayer: any): void {
    this.http.get(this.listDevices).subscribe((res: any) => {
        // const maxPop = Math.max(...res.customer.device.map(x => x.location), 0);

        for (const c of res.customer.device) {
          const lon = c.coords.longitude;
          const lat = c.coords.latitude;

          if (!lon || !lat) {
            continue;
          }

          const status: boolean = Math.random() < 0.5;
          console.log(c)
          const title = c.name;
          const circle = L.circleMarker([lat, lon], {
            title: title,
            color: status ? "green" : 'red',
            fillColor: status ? "green" : 'red',
            weight: 1,
            opacity: 1,
            fillOpacity: 1
          })
            .bindPopup(title)
            .on('click', (ev) => {
              this.observer.next({
                ...c,
                status: status
              });
            });
          // circle.bindPopup(this.popupService.makeCapitalPopup(c.properties));
          markersLayer.addLayer(circle);
          circle.addTo(map);

          // circle.setStyle({fillColor: 'green'});
        }
      }
    );
  }

  makeCapitalMarkers(map: L.map, markersLayer: any): void {
    this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const title = c.properties.state;
        const marker = L.marker([lat, lon], {
          title
        });
        markersLayer.addLayer(marker);
        marker.addTo(map);
      }
    });
  }
}
