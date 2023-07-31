import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit, ViewChild
} from "@angular/core";

import {MarkerMapService} from "@core/services/marker-map.service";
import {MarketStatusService} from "@core/services/market-status.service";
import {SharedDataService} from "@core/services/shared-data.service";

import 'leaflet-fullscreen';
import 'leaflet-search';

import * as L from 'leaflet';
import * as moment from 'moment';

import {webSocket} from "rxjs/webSocket";
import {concatMap, delay, of} from "rxjs";
import {BitcoinPrice} from "@core/services/bitcoin-price";
import {HistoryRadarModel, RadarModel} from "@core/services/radar.model";
import {HttpClient} from "@angular/common/http";

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'tb-dashboard3',
  templateUrl: './dashboard3.component.html',
  styleUrls: ['./dashboard3.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Dashboard3Component implements OnInit, AfterViewInit, OnDestroy {

  private map;
  private markersLayer;
  data: any;
  toggle: boolean = false;
  private isFirstLoad: boolean = true;

  // subject = webSocket('wss://ws.coincap.io/prices?assets=bitcoin')
  // subject = webSocket('ws://172.17.12.52:8000/radar')
  subject = webSocket('ws://localhost:5000/device-realtime?device_id=223528')

  rate: any;
  public mapStyle: any = {};
  chartData: any[] = [];
  tempRawData: HistoryRadarModel[] = [];

  alignTop: number = window.innerHeight - 360;

  @ViewChild('resizeContainer', {static: true}) resizeContainer: ElementRef;

  private initMap(): void {
    this.map = L.map('map', {
      fullscreenControl: true,
      center: [10.776338577271, 106.70006561279],
      zoom: 17
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.markersLayer = new L.LayerGroup();

    this.map.addLayer(this.markersLayer);

    L.control.search({
      layer: this.markersLayer,
      initial: false,
    }).addTo(this.map);
  }

  constructor(
    private sharedDataService: SharedDataService,
    private marketStatusSvc: MarketStatusService,
    private markerService: MarkerMapService,
    private elementRef: ElementRef,
    private http: HttpClient
  ) {
    this.invokeRadar();
  }

  ngOnInit(): void {
    this.markerService.subscriber$.subscribe((data: any) => {
      console.log('markerService', data);
      this.toggle = true;
      this.data = data;
      // this.sharedDataService.setData(this.currMaxHeight);

      // Resize map-container
      this.resizeContainer.nativeElement.style.height = `${window.innerHeight - 300}px`;
      // Resize map
      this.mapStyle = {
        ...this.mapStyle,
        height: `${window.innerHeight - 300}px`,
      };
    });

    this.http.get('assets/data/radar.json').subscribe((data: HistoryRadarModel[]) => {
      // this.tempRawData = data;
    });

    this.mapStyle = {
      // position: 'fixed',
      width: `${window.innerWidth - 65}px`,
      height: `${window.innerHeight - 100}px`,
    };
  }

  currMaxHeight: number = window.innerHeight;

  onHeightChange(newHeight: number) {
    // Handle the new width value received from the directive
    let temp = 0;
    // console.log('New height:', newHeight, this.currMaxHeight);
    if (newHeight > this.currMaxHeight){
      console.log('Update New height:', window.innerHeight, newHeight, this.currMaxHeight);
      temp = newHeight- this.currMaxHeight;
      this.currMaxHeight = this.currMaxHeight + temp;
    }
    this.mapStyle = {
      ...this.mapStyle,
      height: `${this.currMaxHeight}px`
    }
    this.sharedDataService.setData(this.currMaxHeight + (this.toggle ? 300 : 0));
    // You can perform any additional actions here based on the new width value
  }

  // onResizeEnd(event: ResizeEvent): void {
  //   this.mapStyle = {
  //     position: 'fixed',
  //     left: `${event.rectangle.left}px`,
  //     top: `${event.rectangle.top}px`,
  //     width: `${event.rectangle.width}px`,
  //     height: `${event.rectangle.height}px`,
  //   };
  // }
  //
  // validate(event: ResizeEvent): boolean {
  //   const MIN_DIMENSIONS_PX: number = 50;
  //   if (
  //     event.rectangle.width &&
  //     event.rectangle.height &&
  //     (event.rectangle.width < MIN_DIMENSIONS_PX ||
  //       event.rectangle.height < MIN_DIMENSIONS_PX)
  //   ) {
  //     return false;
  //   }
  //   return true;
  // }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(e: Event) {
    this.ngOnDestroy();
  }

  ngOnDestroy(): void {
    this.subject.unsubscribe();
  }

  private invokeRadar() {
    this.subject.pipe(
      concatMap(item => {
        return of(item).pipe(delay(5000));
      })
    ).subscribe((data: any) => {
      if (!data || data == 'null') return;
      // if (Array.isArray(this.tempRawData) && this.isFirstLoad) {
      if (Array.isArray(data) && this.isFirstLoad) {
        let tempInitTruck = 0;
        let totalTruck = 0;

        let tempInitCar = 0;
        let totalCar = 0;

        let tempInitBicycle = 0;
        let totalBicycle = 0;

        let tempInitMotorbike = 0;
        let totalMotorbike = 0;

        // this.data.filter(p => p.direction === 'receding')
        data
          .filter(p => p.direction === 'receding')
          .map(radarData => {
            const record_date_value = radarData.record_date;
            // const milliseconds = value / 1000;
            const recordDate = moment(record_date_value);
            // console.log(record_date_value);
            // console.log(recordDate);
            console.log(moment(recordDate, '%H:%M:%S').toDate())
            // console.log(value, moment(recordDate, '%H:%M:%S').toDate());

            if (tempInitTruck != 0) {
              totalTruck = radarData.truck - tempInitTruck;
              tempInitTruck = radarData.truck;
            } else {
              tempInitTruck = radarData.truck;
            }

            if (tempInitCar != 0) {
              totalCar = radarData.car - tempInitCar;
              tempInitCar = radarData.car;
            } else {
              tempInitCar = radarData.car;
            }

            if (tempInitBicycle != 0) {
              totalBicycle = radarData.bicycle - tempInitBicycle;
              tempInitBicycle = radarData.bicycle;
            } else {
              tempInitBicycle = radarData.bicycle;
            }

            if (tempInitMotorbike != 0) {
              totalMotorbike = radarData.motorbike - tempInitMotorbike;
              tempInitMotorbike = radarData.motorbike;
            } else {
              tempInitMotorbike = radarData.motorbike;
            }

            // console.log('truck', totalTruck, 'car', totalCar, 'bicycle', totalBicycle, 'motorbike', totalMotorbike);
            const radarModel: RadarModel = {
              ...radarData,
              device_id: 1,
              receding: '',
              approaching: '',
              serial: '',
              collection_date: 0,
              record_date: moment(recordDate, '%H:%M:%S').toDate(),
              totalTruck,
              totalCar,
              totalBicycle,
              totalMotorbike
            };
            this.Radars(radarModel);
          });

        this.isFirstLoad = false;
      } else {
        if (!data) {
          return;
        }
        const radarData: HistoryRadarModel = JSON.parse(JSON.stringify(data));
        if (radarData.device_id != 223528)
          return;

        // this.rate = data;
        // this.chartData.push(Number(this.rate.total));
        const rndInt = Math.floor(Math.random() * 10) + 1;
        // const lastDay = moment("21-04-2023", 'DD-MM-YYYY').add(rndInt, 'days');
        const rndDate = new Date();

        const latestData: RadarModel = (this.radars && this.radars.length > 0)
          ? this.radars[this.radars.length - 1] : undefined;
        if (!latestData) return;
        // console.log(radarData.truck, latestData.truck);

        this.Radars({
          ...latestData,
          approaching: '',
          serial: '',
          collection_date: 0,
          receding: '',
          device_id: 123,
          totalTruck: (radarData.truck - (latestData ? latestData.truck : 0)) + this.randomValue(),
          totalCar: (radarData.car - (latestData ? latestData.car : 0)) + this.randomValue(),
          totalBicycle: (radarData.bicycle - (latestData ? latestData.bicycle : 0)) + this.randomValue(),
          totalMotorbike: (radarData.motorbike - (latestData ? latestData.motorbike : 0)) + this.randomValue(),
          record_date: moment(rndDate, '%H:%M:%S').toDate()
          // record_date: moment(radarData.record_date, '%H:%M:%S').toDate()
        });

        // console.log(this.radars.length);
      }
    }, error => {
      this.subject.unsubscribe();
    });
  }

  randomValue(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makeCapitalCircleMarkers(this.map, this.markersLayer);
  }

  onClickInfo() {
    this.toggle = !this.toggle;
    this.mapStyle = {
      ...this.mapStyle,
      height: `${window.innerHeight - (this.toggle ? 420 : 100)}px`,
    }
  }

  toggleEvent(toggleVal: boolean){
    console.log('toggleVal', toggleVal);
    this.toggle = toggleVal;

    this.resizeContainer.nativeElement.style.height = `${window.innerHeight - 100}px`;
    this.mapStyle = {
      ...this.mapStyle,
      height: `${window.innerHeight - 100}px`,
    }
  }

  // ---- D3 Chart
  _bitcoins: BitcoinPrice[] = [];
  bitcoinsToPlot: BitcoinPrice[];

  radars: RadarModel[] = [];
  radarsToPlot: RadarModel[];

  Bitcoins(price: BitcoinPrice) {
    this._bitcoins.push(price);
    this.bitcoinsToPlot = this._bitcoins.slice(0, 20);
  }

  Radars(radar: RadarModel) {
    if (radar.totalMotorbike < 0
      || radar.totalBicycle < 0
      || radar.totalCar < 0
      || radar.totalTruck < 0) {
      console.log(radar);
      return;
    } else {
      console.log('continue ...');
    }

    this.radars.push(radar);
    // this.radarsToPlot = this.radars.length > 10
    //   ? this.radars.slice(-10)
    //   : this.radars;
    this.radarsToPlot = this.radars.slice(-10)
    this.radarsToPlot.map(m => {
      // console.log(m.car, m.bicycle, m.truck, m.motorbike);
      // console.log(m.record_date, m.totalCar, m.totalBicycle, m.totalTruck, m.totalMotorbike);
    })
  }

}

