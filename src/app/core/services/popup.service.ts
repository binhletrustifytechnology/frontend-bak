import {Injectable, Output, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  public selectedMarker: any;

  constructor() {
  }

  makeCapitalPopup(data: any): string {
    this.selectedMarker = data;
    return `` +
      `<div>Capital: ${ data.name }</div>` +
      `<div>State: ${ data.state }</div>` +
      `<div>Population: ${ data.population }</div>`
  }
}
