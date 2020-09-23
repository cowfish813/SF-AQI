  //might not be necesesary anymore?
// const valueLine = d3.line()
//   .x((d) => (x(d.date)))
//   .y((d) => (y(d[" pm25"])));
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

//kinda useless atm, but might be handy for modular code
// const parseTime = d3.timeParse("%Y/%m/%d");

// var myData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const x = d3.scaleTime()
  // .domain(d3.extent(data, (d) => { return d.date; })) //no data yet, append later?
  .range([0, width]);

const y = d3.scaleLinear()
  // .domain([0, 240]) //use a Math.max(data.)something instead of 2nd arg
  .range([height, 0]);


d3.csv("https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco-arkansas%20street%2C%20san%20francisco%2C%20california-air-quality.csv").then((data) => {
  
  data.forEach(d => {

    d.date = d3.timeParse("%Y/%m/%d")(d.date)
    // d.date = d3.timeFormat("%y/%m/%d")(d.date)
    d.pm25 = d[" pm25"];
  });

  x.domain(d3.extent(data, (d) => { 
    console.log(d.date)
    return d.date;
    // return d3.timeParse("%b")
  }));



    //set x axis for month?
        //find a way to key into month
  // x.domain(myData)
  

  y.domain([0, 240]); //use a Math.max(data.)something instead of 2nd arg
  
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));
  
  svg.append("g")
  .call(d3.axisLeft(y))
  
  // Add the line
        //later on, set for hover on dots

  svg
    .data([data])
    .append("path")
      // same thing?
    // .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x((d) => { return x(d.date) })
      .y((d) => { return y(d.pm25) })
    )



    //add point
        //later on => color the dots based on severity
  svg.selectAll("dot")
    .data(data)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", d => (x(d.date)))
      .attr("cy", d => (y(d.pm25)))
      .attr("fill", "#69b3a2") //color
});


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


  // Add the valueline path.
  // svg.append("path")
  //   .data([data])
  //   .attr("class", "line")
  //   .attr("d", valueLine)
    // .attr("fill", "#69b3a2") //color
  // Add the valueline path.