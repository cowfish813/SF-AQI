// console.log(d3)
// import mydata from './jss/SanFranciscoCA'
// import * as data from './js db/SanFranciscoCA.js';
// const sfData = require("./js db/SanFranciscoCA.json")


const container = d3.select('svg')
    .classed('container', true);

let margin = {top: 10, right: 30, bottom: 30, left: 50},
  width = 460 - margin.left - margin.right
  height = 400 - margin.top - margin.bottom

const svg = d3.select('#my_dataviz')
    .append("svg") //adds svg ele
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco%2C%20california%2C%20usa-air-quality.csv",
    (d) => ({ date: d3.timeParse('%Y-%m-%d')(d.date), pm25: d.pm25}),
    //first 90 days....maybe remove this part later, starting with data.filter
    
    (data) => {
      data = data.filter((d, i) => (i > 100))
      
      //adds x axis
        let x = d3.scaleTime()
          .domain(d3.extent(data, (d) => (+d.pm25)))
          .range([0, width]);
          // console.log(d)
        svg.append("g")
          .attr("transform", "translate(0" + (height + 5) + ")")
          .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

        //adds y axis
        let y = d3.scaleLinear()
          .domain( d3.extent(data, (d) => (console.log(d)))) //why is there a plus?
          .range([height, 0]);
        svg.append("g")
          .attr("transform", "translate(-5, 0)")
          .call(d3.axisLeft(y).tickSizeOuter(0));

        //add line
        svg.append("path")
          .datum(data)
          .attr("fill", "#69b3a2")
          .attr("fill-opacity", .3)
          .attr("stroke", "none")
          .attr("d", d3.area()
            .x( d => (x(d.date)))
            .y0(height)
            .y1( d => y(d.pm25))
            )


      // Add the line
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 4)
        .attr("d", d3.line()
          .x(function (d) { return x(d.date) })
          .y(function (d) { return y(d.pm25) })
        )

      // Add the line
      svg.selectAll("myCircles")
        .data(data)
        .enter()
        .append("circle")
          .attr("fill", "red")
          .attr("stroke", "none")
          .attr("cx", function (d) { return x(d.date) })
          .attr("cy", function (d) { return y(d.pm25) })
          .attr("r", 3)

    }
    

);





// const xScale = d3.scaleBand().domain(sfData.map(dataPoint => dataPoint.date)).rangeRound([0,250]).padding(0.1);
// //ordinal scale, all of them uniform
// const yScale = d3.scaleLinear().domain([-1000, 1500]).range([2000, 1000]);
// //gives us different values to translate vals to other num



// const container = d3.select('svg')
//         .classed('container', true) //gives it a class name
//         // .style('border', '1px solid red');

// const bars = container
//     .selectAll('.bar')
//     .data(sfData)
//     .enter()
//     .append('rect') //valid ele
//     .classed('bar', true)
//     .text(d => d)
//     .attr('width', xScale.bandwidth())
//     .attr('height', data => 200 - yScale(data.pm25))
//     .attr('x', data => xScale(data.date))
//     .attr('y', data => yScale(data.pm25))

// // setTimeout(() => {
// //     bars.data(fake.slice(0, 2)).exit().remove();
// // }, 2000)

// const text = bars.selectAll('text')
//     .data(sfData)
//     .enter()
//     .append("text")
//     .text(d =>( d.pm25))
//     // .attr('x', data => xScale -)
//     // .attr('y', data => )



// d3.select('div') //the class div or whatever
//     .selectAll('p') //all paragraphgs
//     .data(sfData) //can be araray or full of strings //binds data
//     .enter() //which are missing?
//     .append('p') //appends p for all missing
//     .text( dta => dta.pm25) //dta gives access to each data node
    
    // .selectAll();

// // const fake = [
// //     {id: 'd1', value: 10, region: 'USA'},
// //     {id: 'd2', value: 11, region: 'SA'},
// //     {id: 'd3', value: 12, region: 'US'},
// //     {id: 'd4', value: 6, region: 'U23542'},
// //     {id: 'd5', value: 15, region: 'US1231A'},
// //     {id: 'd6', value: 12, region: 'U12312SA'},
// //     {id: 'd7', value: 6, region: 'US123A'},
// // ];

// // import sfData from './js db/SanFranciscoCA.json';
// // import beijing from './js db/beijing-air-quality.json';
// // import paris from './js db/paris-air-quality.json';
// // const fetch = require('node-fetch');

// console.log("hello", SanFranciscoCA[0].date)


// var mydata = JSON.parse(SanFranciscoCA)
// console.log("bye",mydata)