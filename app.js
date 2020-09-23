// const data = "https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco%2C%20california%2C%20usa-air-quality.csv"



const margin = {top: 10, right: 30, bottom: 30, left: 50},
  width = 1080 - margin.left - margin.right
  height = 400 - margin.top - margin.bottom

const svg = d3.select('#my_dataviz')
    .append("svg") //adds svg ele
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const parseTime = d3.timeParse("%Y/%m/%d");

const x = d3.scaleTime()
  // .domain(d3.extent(data, (d) => { return d.date; })) //no data yet, append later?
  .range([0, width]);

const y = d3.scaleLinear()
  // .domain([0, 240]) //use a Math.max(data.)something instead of 2nd arg
  .range([height, 0]);


  //might not be necesesary anymore?
const valueLine = d3.line()
  .x((d) => (x(d.date)))
  .y((d) => (y(d[" pm25"])));


d3.csv("https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco%2C%20california%2C%20usa-air-quality.csv").then((data) => {
  // console.log(data)
  data.forEach(d => {
    d.date = parseTime(d.date);
    d.pm25 = d[" pm25"];
  });

  x.domain(d3.extent(data, (d) => { return d.date; }));
  y.domain([0, 240]); //use a Math.max(data.)something instead of 2nd arg



  

  
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));
  
  svg.append("g")
  .call(d3.axisLeft(y))
  
  // Add the valueline path.
  // svg.append("path")
  //   .data([data])
  //   .attr("class", "line")
  //   .attr("d", valueLine)
    // .attr("fill", "#69b3a2") //color
  // Add the valueline path.

  // Add the line
  svg
    .append("path")
    .data([data])
      // same thing?
    // .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x((d) => { return x(d.date) })
      .y((d) => { return y(d.pm25) })
    )

    // Add the points
  // svg
  //   .append("g")
  //   .selectAll("dot")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //   .attr("cx", (d) => { return x(d.date) })
  //   .attr("cy", (d) => { return y(d.pm25) })
  //   .attr("r", 5)
  //   .attr("fill", "#69b3a2")

    //add point
  svg.selectAll("dot")
    .data(data)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", d => (x(d.date)))
      .attr("cy", d => (y(d.pm25)))
      .attr("fill", "#69b3a2") //color
});



