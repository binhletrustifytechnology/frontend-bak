export interface Device {
  id:number;
  name:string;
  slcDeviceAddress: string;
  location: string;
  coords: Coords;
}

export interface Coords {
  latitude: string;
  longitude: string;
}
