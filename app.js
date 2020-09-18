// // console.log(d3)

// let container = d3.select('svg')
//     .classed('container', true);

let margin = {top: 10, right: 30, bottom: 30, left: 50},
  width = 1080 - margin.left - margin.right
  height = 400 - margin.top - margin.bottom

let svg = d3.select('#my_dataviz')
    .append("svg") //adds svg ele
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



d3.csv("https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco%2C%20california%2C%20usa-air-quality.csv",
  // function (d) {
  //   // console.log(d3.timeParse("%Y/%m/%d")(d.date))
  //   return { date: d3.timeParse("%Y/%m/%d")(d.date), pm25: d[" pm25"] } //in brackets because it's a string
  // },
  (d) => {
    return { date: d3.timeParse("%Y/%m/%d")(d.date), pm25: d[" pm25"] } //change year
  },
  
  // Now I can use this dataset:
  function (data) {
    // console.log(data)
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function (d) { return d.date; }))
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 240]) //use a Math.max(data.)something instead of 2nd arg
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) { return x(d.date) })
        .y(function (d) { return y(d.pm25) })
      )
    // Add the points
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.date) })
      .attr("cy", function (d) { return y(d.pm25) })
      .attr("r", 5)
      .attr("fill", "#69b3a2")
  });
