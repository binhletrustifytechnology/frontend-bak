import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, Output, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import * as moment from "moment";
import {RadarModel} from "@core/services/radar.model";

const HH_MM_SS = '%H:%M:%S';

@Component({
  selector: 'tt-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadarChartComponent implements OnChanges {
  @ViewChild('chart')
  chartElement: ElementRef;

  parseDate = d3.timeParse(HH_MM_SS);

  @Input()
  radarStatus: RadarModel[];

  private svgElement: HTMLElement;
  private chartProps: any;

  constructor() {
  }

  ngOnChanges() {
    if (this.radarStatus && this.chartProps) {
      this.updateChart();
    } else if (this.radarStatus) {
      this.buildChart();
    }
  }

  formatDate() {
    this.radarStatus.forEach(ms => {
      if (typeof ms.record_date === 'string') {
        // console.log('formatDate', this.parseDate(ms.record_date));
        ms.record_date = this.parseDate(ms.record_date);
      }
    });
  }

  buildChart() {
    this.chartProps = {};
    this.formatDate();

    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 600 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

    // Set the ranges
    this.chartProps.x = d3.scaleTime().range([0, width]);
    this.chartProps.y = d3.scaleLinear().range([height, 0]);

    // Define the axes
    var xAxis = d3.axisBottom(this.chartProps.x).tickFormat(d3.timeFormat('%H:%M:%S'));
    var yAxis = d3.axisLeft(this.chartProps.y).ticks(5);

    let _this = this;

    const recordDateAttr: string = 'record_date';

    // Define the line bicycle/truck/car/motorbike
    var valuelineTruck = d3.line<RadarModel>()
      .x(function (d) {
        if (d[recordDateAttr] instanceof Date) {
          return _this.chartProps.x(d[recordDateAttr].getTime());
        }
      })
      .y(function (d) {
        return _this.chartProps.y(d['totalTruck']);
      });

    var valuelineCar = d3.line<RadarModel>()
      .x(function (d) {
        if (d[recordDateAttr] instanceof Date) {
          return _this.chartProps.x(d[recordDateAttr].getTime());
        }
      })
      .y(function (d) {
        return _this.chartProps.y(d['totalCar']);
      });

    var valuelineBicycle = d3.line<RadarModel>()
      .x(function (d) {
        if (d[recordDateAttr] instanceof Date) {
          return _this.chartProps.x(d[recordDateAttr].getTime());
        }
      })
      .y(function (d) {
        return _this.chartProps.y(d['totalBicycle']);
      });

    var valuelineMotorbike = d3.line<RadarModel>()
      .x(function (d) {
        if (d[recordDateAttr] instanceof Date) {
          return _this.chartProps.x(d[recordDateAttr].getTime());
        }
      })
      .y(function (d) {
        return _this.chartProps.y(d['totalMotorbike']);
      });

    var svg = d3.select(this.chartElement.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scale the range of the data
    this.chartProps.x.domain(
      d3.extent(_this.radarStatus, function (d) {
        if (d.record_date instanceof Date)
          return (d.record_date as Date).getTime();
      }));

    this.chartProps.y.domain([0, d3.max(this.radarStatus, function (d) {
      return Math.max(d.totalCar, d.totalTruck, d.totalBicycle, d.totalMotorbike)
    })]);

    // Add the valueline path.
    svg.append('path')
      .attr('class', 'line line1')
      .style('stroke', 'black')
      .style('fill', 'none')
      .attr('d', valuelineTruck(_this.radarStatus));

    // Add the valueline2 path.
    svg.append('path')
      .attr('class', 'line line2')
      .style('stroke', 'green')
      .style('fill', 'none')
      .attr('d', valuelineCar(_this.radarStatus));

    // Add the valueline3 path.
    svg.append('path')
      .attr('class', 'line line3')
      .style('stroke', 'blue')
      .style('fill', 'none')
      .attr('d', valuelineBicycle(_this.radarStatus));

    // Add the valueline4 path.
    svg.append('path')
      .attr('class', 'line line4')
      .style('stroke', 'red')
      .style('fill', 'none')
      .attr('d', valuelineMotorbike(_this.radarStatus));

    svg.selectAll('text')
      .data(_this.radarStatus)
      .enter()
      // .text(d => String(d.record_date))
      .text(function(d) { return ("Serie "); });

    // Add the X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    // Add the Y Axis
    svg.append('g')
      .attr('class', 'y axis')
      // .text(function(d) { return ("Serie "); })
      .call(yAxis);

    svg
      .append("text")
      .attr("transform", `translate(${width},${margin.bottom})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .style("fill", "green")
      .text("Car ---");

    svg
      .append("text")
      .attr("transform", `translate(${width},${margin.bottom - 15})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .style("fill", "black")
      .text("Truck ---");

    svg
      .append("text")
      .attr("transform", `translate(${width},${margin.bottom - 30})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .style("fill", "red")
      .text("Motorbike ---");

    svg
      .append("text")
      .attr("transform", `translate(${width},${margin.bottom - 45})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .style("fill", "blue")
      .text("Bicycle ---");

    // svg.append("text")
    //   .attr("class","serie_label")
    //   .text(function(d) { return ("Serie "); })

    // Setting the required objects in chartProps so they could be used to update the chart
    this.chartProps.svg = svg;
    // this.chartProps.svg.selectAll('.tick text')
    //   .attr('transform', 'rotate(-45)');
    this.chartProps.valueline = valuelineTruck;
    this.chartProps.valueline2 = valuelineCar;
    this.chartProps.valueline3 = valuelineBicycle;
    this.chartProps.valueline4 = valuelineMotorbike;
    this.chartProps.xAxis = xAxis;
    this.chartProps.yAxis = yAxis;
  }

  updateChart() {
    // console.log('--updateChart--', this.radarStatus);
    let _this = this;
    this.formatDate();

    // Scale the range of the data again
    this.chartProps.x.domain(d3.extent(this.radarStatus, function (d) {
      if (d.record_date instanceof Date) {
        return d.record_date;
      }
    }));

    this.chartProps.y.domain([0, d3.max(this.radarStatus, function (d) {
      return Math.max(d.totalCar, d.totalTruck, d.totalMotorbike, d.totalBicycle);
    })]);

    // Select the section we want to apply our changes to
    this.chartProps.svg.transition();

    // this.chartProps.svg.selectAll('.tick text')
    //   .attr('transform', 'rotate(-45)');

    // Make the changes to the line chart
    this.chartProps.svg.select('.line.line1') // update the line
      .attr('d', this.chartProps.valueline(this.radarStatus));

    this.chartProps.svg.select('.line.line2')
      .attr('d', this.chartProps.valueline2(this.radarStatus));

    this.chartProps.svg.select('.line.line3')
      .attr('d', this.chartProps.valueline3(this.radarStatus));

    this.chartProps.svg.select('.line.line4')
      .attr('d', this.chartProps.valueline4(this.radarStatus));

    this.chartProps.svg.select('.x.axis') // update x axis
      .call(this.chartProps.xAxis);

    this.chartProps.svg.select('.y.axis') // update y axis
      .call(this.chartProps.yAxis);
  }
}
