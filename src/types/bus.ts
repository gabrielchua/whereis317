export interface BusArrival {
  ServiceNo: string;
  Operator: string;
  NextBus: BusInfo;
  NextBus2: BusInfo;
  NextBus3: BusInfo;
}

export interface BusInfo {
  EstimatedArrival: string;
  Load: string;
  Feature: string;
  Type: string;
}

export interface BusArrivalResponse {
  'odata.metadata': string;
  BusStopCode: string;
  Services: BusArrival[];
} 