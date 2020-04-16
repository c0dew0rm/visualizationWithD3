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
    console.log(this.chartData);
    var data = this.chartData;

    var svg = d3.select(".my_bar");
    console.log(svg);
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("width") - margin.top - margin.bottom;

// set the ranges
var y = d3.scaleBand()
          .range([height, 0])
          .padding(0.1);

var x = d3.scaleLinear()
          .range([0, width]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
let g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // format the data
  data.forEach(function(d) {
    d.val_1 = +d.val_1;
    d.val_2 = +d.val_2;
    if(d.val_2 > +d.val_1) {
      console.log("value2")
      d['color'] = "red";
    }
    else {
      console.log("value1");
      d['color'] = "green";
    }
  });
console.log(data);
  // Scale the range of the data in the domains
  x.domain([0, d3.max(data, function(d){ return d.val_1; })])
  y.domain(data.map(function(d) { return d.brand; }));

  // add the x Axis
  g.append("g")
  .attr("class", "axis x_axis")
  .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y Axis
  g.append("g")
  .attr("class", "axis y_axis")
  .call(d3.axisLeft(y));

  // append the rectangles for the bar chart
  g.selectAll(".bar1")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar1")
      .attr("y", function(d) { return y(d.brand)+20; })
      .style("fill", function(d) {return d.color})
      .attr("width", function(d) {return x(d.val_1); } )
      .attr("height", y.bandwidth()-40);
  
  g.selectAll(".bar2")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar2")
    .attr("y", function(d) { return y(d.brand); })
    .style("fill", function(d) {return d.color})
    .style("opacity","0.5")
    .attr("width", function(d) {return x(d.val_2); } )
    .attr("height", y.bandwidth());

  }

}
