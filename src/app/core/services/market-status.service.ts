import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {MarketPrice} from "@core/services/market-price";
import * as socketio from 'socket.io-client';
import {from, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MarketStatusService {
  // private baseUrl = 'http://localhost:3000';
  private baseUrl = 'ws://172.17.12.52:8000/radar';

  constructor(private httpClient: HttpClient) {
  }

  getInitialMarketStatus() {
    return this.httpClient.get<MarketPrice[]>(`${this.baseUrl}/api/market`);
  }

  getUpdates() {
    // @ts-ignore
    let socket = socketio(this.baseUrl);
    let marketSub = new Subject<MarketPrice>();
    let marketSubObservable = from(marketSub);

    socket.on('market', (marketStatus: MarketPrice) => {
      marketSub.next(marketStatus);
    });

    return marketSubObservable;
  }
}
