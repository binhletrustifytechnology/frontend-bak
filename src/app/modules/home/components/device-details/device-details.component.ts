import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {HttpClient} from "@angular/common/http";
import {Device} from "@modules/home/components/device/device.model";
import {HistoryRadarModel} from "@core/services/radar.model";
import * as moment from "moment";

@Component({
  selector: 'app-device-details',
  templateUrl: 'device-details.component.html',
  styleUrls: ['device-details.component.scss']
})
export class DeviceDetailsComponent implements AfterViewInit {

  @ViewChild('chartContainer')
  private chartContainer: ElementRef;

  private data: HistoryRadarModel[] = [];

  private margin = {top: 20, right: 20, bottom: 30, left: 60};

  private width: number;
  private height: number;
  private svg: any;
  private xScale: any;
  private yScale: any;
  private line: any;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  private calculateTotal(data: HistoryRadarModel[], index: number, attr: string): number {
    const currentVal = data[index][attr];
    const previousVal = data[index - 1] ? data[index - 1][attr] : currentVal;
    return currentVal - previousVal;
  }

  private loadData(): void {
    this.httpClient
      .get<HistoryRadarModel[]>('/assets/data/historyLightRadar.json')
      .subscribe(data => {
        const tempData = data.filter(p => p.direction === 'receding');
        this.data = tempData.map((item, i) => {
            // const currentCar = tempDate[i].car;
            // const previousCar = tempDate[i - 1] ? tempDate[i - 1].car : currentCar;
            // const totalCar = currentCar - previousCar;

            return {
              ...item,
              totalBicycle: this.calculateTotal(tempData, i, 'bicycle'),
              totalCar: this.calculateTotal(tempData, i, 'car'),
              totalMotorbike: this.calculateTotal(tempData, i, 'motorbike'),
              totalTruck: this.calculateTotal(tempData, i, 'truck'),
            }
          });
        this.createChart();
        this.drawChart();
      });
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  func(d): any {
    return {
      date: d3.timeParse("%Y-%m-%d")(d.date),
      value: d.value
    };
  }

  private createChart(): void {
    this.width = this.chartContainer.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.chartContainer.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    console.log(this.data);

    this.xScale = d3.scaleTime()
      .domain(d3.extent(this.data, d => {
        const recordDate = moment(d.record_date);
        const step1 = moment(recordDate, '%Y-%m-%dT%H:%M:%S.%LZ').toDate();
        console.log(step1, d.totalCar);
        return step1;
      }))
      .range([0, this.width]);

    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.xScale));

    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.totalCar)])
      .range([this.height, 0]);
    this.svg.append("g")
      .call(d3.axisLeft(this.yScale));

    this.svg.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x((d: any) => this.xScale(d.record_date))
        .y((d: any) => this.yScale(d.totalBicycle))
      );

    this.svg.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x((d: any) => this.xScale(d.record_date))
        .y((d: any) => this.yScale(d.totalCar))
      );

    this.svg.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x((d: any) => this.xScale(d.record_date))
        .y((d: any) => this.yScale(d.totalMotorbike))
      );

    this.svg.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "aqua")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x((d: any) => this.xScale(d.record_date))
        .y((d: any) => this.yScale(d.totalTruck))
      );

    // this.line = d3.line()
    //   .x((d: any) => this.xScale(d.record_date))
    //   .y((d: any) => this.yScale(d.car));
  }

  private drawChart(): void {
    this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(this.xScale));

    this.svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(this.yScale));

    this.svg.append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', this.line);
  }

  download() {
    const jsonStr = JSON.stringify(this.data);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();

    // Clean up the temporary URL object after download
    URL.revokeObjectURL(url);
  }
}
