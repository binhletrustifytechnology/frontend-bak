import {AfterViewInit, ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit} from "@angular/core";

import {MarkerMapService} from "@core/services/marker-map.service";
import {MarketPrice} from "@core/services/market-price";
import {MarketStatusService} from "@core/services/market-status.service";

import * as L from 'leaflet';
import 'leaflet-fullscreen';
import 'leaflet-search';
import * as moment from 'moment';

import {webSocket} from "rxjs/webSocket";
import {concatMap, delay, of} from "rxjs";
import {BitcoinPrice} from "@core/services/bitcoin-price";
import {HistoryRadarModel, RadarModel, TrafficData} from "@core/services/radar.model";
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
  selector: 'tb-dashboard-table',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private map;
  private markersLayer;
  data: any;
  toogle: boolean = false;
  private isFirstLoad: boolean = true;

  subject = webSocket('wss://ws.coincap.io/prices?assets=bitcoin')
  // subject = webSocket('ws://172.17.12.52:8000/radar')

  rate: any;
  chartData: any[] = [];
  tempRawData: HistoryRadarModel[] = [];

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
      // propertyName: 'title', // Name property in the GeoJSON data
    }).addTo(this.map);

    // const markersLayer = new L.LayerGroup();
    // this.map.addLayer(markersLayer);

  }

  // constructor(
  //   private markerService: MarkerMapService
  // ) {}


  constructor(
    private marketStatusSvc: MarketStatusService,
    private markerService: MarkerMapService,
    private http: HttpClient
  ) {
    console.log('--constructor--');
    // this.marketStatusSvc.getInitialMarketStatus()
    //   .subscribe(prices => {
    //     this.MarketStatus = prices;
    //
    //     let marketUpdateObservable = this.marketStatusSvc.getUpdates();  // 1
    //     marketUpdateObservable.subscribe((latestStatus: MarketPrice) => {  // 2
    //       this.MarketStatus = [latestStatus].concat(this.marketStatus);  // 3
    //     });  // 4
    //   });

    // BITCOIN ---
    // this.invokeBitcoin();


    // ----- RADAR ------

    // "receding": "\"{\\\"total\\\": 32278, \\\"truck\\\": 652, \\\"car\\\": 13225, \\\"motorbike\\\": 14026, \\\"bicycle\\\": 1240, \\\"person\\\": 1391, \\\"unknown\\\": 1744}\""
    // "receding": "{\"total\": 32278, \"truck\": 652, \"car\": 13225, \"motorbike\": 14026, \"bicycle\": 1240, \"person\": 1391, \"unknown\": 1744}"

    // const jsonString = `{
    //     "device_id": 225068,
    //     "serial": "5015415",
    //     "record_date": 1689399562000000,
    //     "collection_date": 1689757651829301,
    //     "approaching": "{\\"total\\": 1672190, \\"truck\\": 8137, \\"car\\": 343933, \\"motorbike\\": 1193258, \\"bicycle\\": 5546, \\"person\\": 46292, \\"unknown\\": 75024}",
    //     "receding": "\\"{\\\\\\"total\\\\\\": 32278, \\\\\\"truck\\\\\\": 652, \\\\\\"car\\\\\\": 13225, \\\\\\"motorbike\\\\\\": 14026, \\\\\\"bicycle\\\\\\": 1240, \\\\\\"person\\\\\\": 1391, \\\\\\"unknown\\\\\\": 1744}\\""
    // }`;
    // const data: RadarModel = JSON.parse(jsonString);
    // console.log(data.receding);
    // const jsonObject = JSON.parse(data.receding);
    // console.log(jsonObject);
    // const jsonObject2: TrafficData = JSON.parse(jsonObject);
    // console.log(jsonObject2);

    this.invokeRadar();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(e: Event) {
    this.ngOnDestroy();
  }

  ngOnDestroy(): void {
    // console.log('--destroy--');
    this.subject.unsubscribe();
  }


  private invokeRadar() {
    this.subject.pipe(
      concatMap(item => {
        // console.log('item', item);
        // if (item && item != 'null') {
        //   const temp: JSON = {} as JSON;
        //   return of(temp);
        // }
        return of(item).pipe(delay(5000));
      })
    ).subscribe((data: any) => {
      if (!data || data == 'null') return;
      // const rawData = JSON.parse(data);
      // console.log('rawData', rawData);


      // console.log('rawData', this.tempRawData);
      // console.log('is an array', Array.isArray(this.tempRawData));
      // console.log('is first load', this.isFirstLoad);
      if (Array.isArray(this.tempRawData) && this.isFirstLoad) {
        console.log('length', this.tempRawData.length);
        let tempInitTruck = 0;
        let totalTruck = 0;

        let tempInitCar = 0;
        let totalCar = 0;

        let tempInitBicycle = 0;
        let totalBicycle = 0;

        let tempInitMotorbike = 0;
        let totalMotorbike = 0;
        this.tempRawData.filter(p => p.direction === 'receding')
          .map(radarData => {
            const value = radarData.record_date;
            const milliseconds = value / 1000;
            const recordDate = moment(milliseconds);

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

            console.log('truck', totalTruck, 'car', totalCar, 'bicycle', totalBicycle, 'motorbike', totalMotorbike);
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
            // console.log(radarModel);
            this.Radars(radarModel);
          });

        this.isFirstLoad = false;
      } else {
        if (data && data.bitcoin) {
          return;
        }
        const radarData: RadarModel = JSON.parse(data);
        if (radarData.device_id != 223528)
          return;
        const receding = JSON.parse(radarData.receding);
        // console.log(receding);
        const jsonObject2: TrafficData = JSON.parse(receding);
        // console.log(jsonObject2);

        this.rate = data;
        this.chartData.push(Number(this.rate.total));

        const rndInt = Math.floor(Math.random() * 100) + 1;

        const lastDay = moment("21-04-2023", 'DD-MM-YYYY').add(rndInt, 'days');
        const rndDate = new Date();

        this.Radars({
          ...radarData,
          totalTruck: jsonObject2.total + rndInt,
          totalCar: jsonObject2.total + rndInt,
          record_date: moment(rndDate, '%H:%M:%S').toDate()
          // record_date: moment(radarData.record_date, '%H:%M:%S').toDate()
        });
      }
    }, error => {
      this.subject.unsubscribe();
    });
  }

  private invokeBitcoin() {
    this.subject.pipe(
      concatMap(item => of(item).pipe(delay(5000)))
    ).subscribe((data: any) => {
      // console.log('data', data);
      this.rate = data;
      this.chartData.push(Number(this.rate.bitcoin));

      const rndInt = Math.floor(Math.random() * 100) + 1;

      const lastDay = moment("21-04-2023", 'DD-MM-YYYY').add(rndInt, 'days');
      const rndDate = new Date();
      this.Bitcoins({
        bitcoin: rndInt,
        date: moment(rndDate, '%H:%M:%S').toDate()
      });
    })
  }

  ngAfterViewInit(): void {
    this.initMap();
    // this.markerService.makeCapitalMarkers(this.map, this.markersLayer);
    this.markerService.makeCapitalCircleMarkers(this.map, this.markersLayer);
  }

  ngOnInit(): void {
    // console.log('--init--');
    this.markerService.subscriber$.subscribe(data => {
      this.data = data;
    });

    this.http.get('assets/data/radar.json').subscribe((data: HistoryRadarModel[]) => {
      this.tempRawData = data;
    });
  }

  // ---- D3 Chart
  marketStatus: MarketPrice[];
  marketStatusToPlot: MarketPrice[];

  _bitcoins: BitcoinPrice[] = [];
  bitcoinsToPlot: BitcoinPrice[];

  radars: RadarModel[] = [];
  radarsToPlot: RadarModel[];

  Bitcoins(price: BitcoinPrice) {
    this._bitcoins.push(price);
    this.bitcoinsToPlot = this._bitcoins.slice(0, 20);
  }

  Radars(radar: RadarModel) {
    this.radars.push(radar);
    this.radarsToPlot = this.radars.slice(0, 20);
  }

  set MarketStatus(status: MarketPrice[]) {
    this.marketStatus = status;
    this.marketStatusToPlot = this.marketStatus.slice(0, 20);
  }

}

