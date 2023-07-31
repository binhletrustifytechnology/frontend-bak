import Chart from 'chart.js/auto';
import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";


@Component({
  selector: 'tt-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LineChartComponent implements OnInit {

  public chart: any;

  constructor() {
  }

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['2023-07-10', '2023-07-11', '2023-07-12','2023-07-13',
          '2023-07-14', '2023-07-15', '2023-07-16','2023-07-17', ],
        datasets: [
          {
            label: "motorbike",
            data: ['467','576', '572', '79', '92', '574', '573', '576'],
            backgroundColor: 'blue'
          },
          {
            label: "car",
            data: ['542', '542', '536', '327', '17', '0.00', '538', '541'],
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }

    });
  }
}
