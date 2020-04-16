import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CSVRecord } from './CSVModel';  

import * as d3 from "d3";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'visualization';
  chartData = [];

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;

  @ViewChild('chart') private chartContainer: ElementRef;
  private data: Array<any>;

  constructor() {}

  ngOnInit() { }

  // ngOnChanges() {
  //   if (this.chart) {
  //     this.updateChart();
  //   }
  // }

  public records: any[] = [];  
  @ViewChild('csvReader') csvReader: any;  
  
  uploadListener($event: any): void {  
  
    let text = [];  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
  
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);  
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }  
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        let csvRecord: CSVRecord = new CSVRecord();  
        csvRecord.brand = curruntRecord[0].trim();  
        csvRecord.val_1 = curruntRecord[1].trim();  
        csvRecord.val_2 = curruntRecord[2].trim();  
        csvRecord.mark_val = curruntRecord[3].trim();  
        // csvRecord.position = curruntRecord[4].trim();  
        // csvRecord.mobile = curruntRecord[5].trim();  
        csvArr.push(csvRecord);  
      }  
    }
    this.chartData = csvArr;
    return csvArr;
  }  
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }
    return headerArray;  
  }

  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = [];  
  }  

  onClick() {
    console.log(this.chartData)
    // this.createChart();
    // if (this.chartData) {
    //   this.updateChart();
    // }
  }

//   createChart() {
//     let element = this.chartContainer.nativeElement;
//     this.width = element.offsetWidth - this.margin.left - this.margin.right;
//     this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
//     let svg = d3.select(element).append('svg')
//       .attr('width', element.offsetWidth)
//       .attr('height', element.offsetHeight);

//     // chart plot area
//     this.chart = svg.append('g')
//       .attr('class', 'bars')
//       .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

//     // define X & Y domains
//     let xDomain = this.chartData.map(d => d[0]);
//     let yDomain = [0, d3.max(this.data, d => d[1])];

//     // create scales
//     this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
//     this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

//     // bar colors
//     this.colors = d3.scaleLinear().domain([0, this.chartData.length]).range(<any[]>['red', 'blue']);

//     // x & y axis
//     this.xAxis = svg.append('g')
//       .attr('class', 'axis axis-x')
//       .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
//       .call(d3.axisBottom(this.xScale));
//     this.yAxis = svg.append('g')
//       .attr('class', 'axis axis-y')
//       .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
//       .call(d3.axisLeft(this.yScale));
//   }

//   updateChart() {
//     // update scales & axis
//     this.xScale.domain(this.chartData.map(d => d[0]));
//     this.yScale.domain([0, d3.max(this.chartData, d => d[1])]);
//     this.colors.domain([0, this.chartData.length]);
//     this.xAxis.transition().call(d3.axisBottom(this.xScale));
//     this.yAxis.transition().call(d3.axisLeft(this.yScale));

//     let update = this.chart.selectAll('.bar')
//       .data(this.chartData);

//     // remove exiting bars
//     update.exit().remove();

//     // update existing bars
//     this.chart.selectAll('.bar').transition()
//       .attr('x', d => this.xScale(d[0]))
//       .attr('y', d => this.yScale(d[1]))
//       .attr('width', d => this.xScale.bandwidth())
//       .attr('height', d => this.height - this.yScale(d[1]))
//       .style('fill', (d, i) => this.colors(i));

//     // add new bars
//     update
//       .enter()
//       .append('rect')
//       .attr('class', 'bar')
//       .attr('x', d => this.xScale(d[0]))
//       .attr('y', d => this.yScale(0))
//       .attr('width', this.xScale.bandwidth())
//       .attr('height', 0)
//       .style('fill', (d, i) => this.colors(i))
//       .transition()
//       .delay((d, i) => i * 10)
//       .attr('y', d => this.yScale(d[1]))
//       .attr('height', d => this.height - this.yScale(d[1]));
//   }

//   generateData() {
//     this.chartData = [];
//     for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
//     this.chartData.push([
//     `Index ${i}`,
//     Math.floor(Math.random() * 100)
//     ]);
//    }
//  }

}
