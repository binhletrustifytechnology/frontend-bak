// Interface for the approaching and receding objects
interface TrafficData {
  total: number;
  truck: number;
  car: number;
  motorbike: number;
  bicycle: number;
  person: number;
  unknown: number;
}

// Interface for the main data structure
interface RadarModel {
  device_id: number;
  serial: string;
  record_date: string | Date;
  collection_date: number;
  approaching: string;
  receding: string;

  total: number;
  truck: number;
  car: number;
  motorbike: number;
  bicycle: number;
  person: number;
  unknown: number;

  totalCar: number;
  totalTruck: number;
  totalBicycle: number;
  totalMotorbike: number;
}

interface RadarChartModel {
  record_date: string | Date;
  total: number;
}

interface HistoryRadarModel {
  id: number;
  serial_number: string;
  direction: string;
  total: number;
  truck: number;
  car: number;
  motorbike: number;
  bicycle: number;
  person: number;
  unknown: number;
  record_date: number;
  insert_date: number;
  device_id: number;

  totalCar?: number;
  totalTruck?: number;
  totalBicycle?: number;
  totalMotorbike?: number;
}

export {RadarModel, TrafficData, HistoryRadarModel}
