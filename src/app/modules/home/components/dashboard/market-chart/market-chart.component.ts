import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {BitcoinPrice} from "@core/services/bitcoin-price";
import * as moment from "moment";
// import {MarketPrice} from "@core/services/market-price";

const HH_MM_SS = '%H:%M:%S';
@Component({
  selector: 'app-market-chart',
  templateUrl: './market-chart.component.html',
  styleUrls: ['./market-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketChartComponent implements OnChanges {
  @ViewChild('chart')
  chartElement: ElementRef;

  // parseDate = d3.timeParse('%d-%m-%Y');
  parseDate = d3.timeParse(HH_MM_SS);

  @Input()
  // marketStatus: MarketPrice[];
  marketStatus: BitcoinPrice[];

  private svgElement: HTMLElement;
  private chartProps: any;

  constructor() {
  }

  ngOnChanges() {
    if (this.marketStatus && this.chartProps) {
      this.updateChart();
    } else if (this.marketStatus) {
      this.buildChart();
    }
  }

  formatDate() {
    this.marketStatus.forEach(ms => {
      if (typeof ms.date === 'string') {
        console.log('formatDate', this.parseDate(ms.date));
        ms.date = this.parseDate(ms.date);
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

    // Define the line
    var valueline = d3.line<BitcoinPrice>()
      .x(function (d) {
        if (d.date instanceof Date) {
          return _this.chartProps.x(d.date.getTime());
        }
      })
      .y(function (d) {
        // console.log('Close market');
        return _this.chartProps.y(d.bitcoin);
      });

    // Define the line
    // var valueline2 = d3.line<BitcoinPrice>()
    //   .x(function (d) {
    //     if (d.date instanceof Date) {
    //       return _this.chartProps.x(d.date.getTime());
    //     }
    //   })
    //   .y(function (d) {
    //     console.log('Open market');
    //     return _this.chartProps.y(d.bitcoin);
    //   });

    var svg = d3.select(this.chartElement.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scale the range of the data
    this.chartProps.x.domain(
      d3.extent(_this.marketStatus, function (d) {
        if (d.date instanceof Date)
          return (d.date as Date).getTime();
      }));
    this.chartProps.y.domain([0, d3.max(this.marketStatus, function (d) {
      return d.bitcoin;
    })]);

    // Add the valueline2 path.
    // svg.append('path')
    //   .attr('class', 'line line2')
    //   .style('stroke', 'green')
    //   .style('fill', 'none')
    //   .attr('d', valueline2(_this.marketStatus));

    // Add the valueline path.
    svg.append('path')
      .attr('class', 'line line1')
      .style('stroke', 'black')
      .style('fill', 'none')
      .attr('d', valueline(_this.marketStatus));


    // Add the X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    // Add the Y Axis
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // Setting the required objects in chartProps so they could be used to update the chart
    this.chartProps.svg = svg;
    // this.chartProps.svg.selectAll('.tick text')
    //   .attr('transform', 'rotate(-45)');
    this.chartProps.valueline = valueline;
    // this.chartProps.valueline2 = valueline2;
    this.chartProps.xAxis = xAxis;
    this.chartProps.yAxis = yAxis;
  }

  updateChart() {
    let _this = this;
    this.formatDate();

    // Scale the range of the data again
    this.chartProps.x.domain(d3.extent(this.marketStatus, function (d) {
      if (d.date instanceof Date) {
        return d.date;
      }
    }));

    this.chartProps.y.domain([0, d3.max(this.marketStatus, function (d) {
      return d.bitcoin;
    })]);

    // Select the section we want to apply our changes to
    this.chartProps.svg.transition();

    // this.chartProps.svg.selectAll('.tick text')
    //   .attr('transform', 'rotate(-45)');

    // Make the changes to the line chart
    this.chartProps.svg.select('.line.line1') // update the line
      .attr('d', this.chartProps.valueline(this.marketStatus));

    // this.chartProps.svg.select('.line.line2')
    //   .attr('d', this.chartProps.valueline2(this.marketStatus));

    this.chartProps.svg.select('.x.axis') // update x axis
      .call(this.chartProps.xAxis);

    this.chartProps.svg.select('.y.axis') // update y axis
      .call(this.chartProps.yAxis);
  }
}
