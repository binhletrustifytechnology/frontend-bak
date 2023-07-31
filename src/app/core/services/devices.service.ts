import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Device} from "@modules/home/components/device/device.model";


@Injectable()
export class DevicesService {

  private listDevices: string = '/assets/data/listDevices.json';

  constructor(
    private httpClient: HttpClient
  ) {

  }

  findDeviceById(deviceId: number): Observable<Device> {
    return this.httpClient.get<Device>(`${this.listDevices}/api/devices/${deviceId}`);
  }

  findAllDevices(): Observable<Device[]> {
    return this.httpClient.get(this.listDevices)
      .pipe(
        map(res => {
          console.log(res['customer']['device']);
          return res['customer']['device'];
        })
      );
  }

  // findAllCourseLessons(courseId:number): Observable<Lesson[]> {
  //   return this.http.get('/api/lessons', {
  //     params: new HttpParams()
  //       .set('courseId', courseId.toString())
  //       .set('pageNumber', "0")
  //       .set('pageSize', "1000")
  //   }).pipe(
  //     map(res =>  res["payload"])
  //   );
  // }

  findDevices(
    deviceId: number, sortOrder = 'asc',
    pageNumber = 0, pageSize = 3, sortColumn = 'seqNo'): Observable<Device[]> {

    return this.httpClient.get(`${this.listDevices}/api/lessons`, {
      params: new HttpParams()
        .set('courseId', deviceId.toString())
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
        .set('sortColumn', sortColumn)
    }).pipe(
      map(res => res["payload"])
    );
  }

}
