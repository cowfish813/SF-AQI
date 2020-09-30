// require('dotenv').config()
const csvSF = "https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco-arkansas%20street%2C%20san%20francisco%2C%20california-air-quality.csv";
let sensorSite = "california/san-francisco/san-francisco-arkansas-street";
const data = {};
const test = "https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco%2C%20california%2C%20usa-air-quality.csv"
const token = "9c249e12bd6b8b2edc5681e555d3f5454a6488b3"; //how to without jquery/react?

const widget = () => (fetch(`https://api.waqi.info/feed/${sensorSite}/?token=${token}`)
  .then(res => (res.json()))
  .then(res => {
    if (res) {
      for (let key in res) {
        data[key] = res[key];
      };
      const aqi = data.data.aqi;
      let status = "";
      let color = ""
      if (aqi > 300) {
          status = "Hazardous";
          color ="brown";
        } else if (aqi > 200) {
          status = "Very Unhealthy";
          color ="puple";
        } else if (aqi > 151) {
          status = "Unhealthy";
          color = "red";
        } else if (aqi > 150) {
          status = "Unhealthy for Sensitive Groups";
          color = "orange";
        } else if (aqi > 50) {
          status = "Moderate";
          color = "yellow";
        } else {
          status = "Good";
          color = "greenyellow";
        };
        //assembles widget without jank or preloaded elements
            //appends HTML elements to the DOM for efficient loading
        document.getElementById("aqi_widget").style.backgroundColor = color;
        document.getElementById("aqi_widget").style.border = "1px black solid";
        document.getElementById("title_conditions").innerHTML = "Conditions Today";
        document.getElementById("status").innerHTML = status;
        document.getElementById("aqi").innerHTML = aqi;
        document.getElementById("sensor_site").innerHTML = "Sensor Location:";
        document.getElementById("city").innerHTML = data.data.city.name;
    } else {
      //hide that damed key
      console.log("API limit exhausted");
    };
  })
  .catch(err => {
    console.log(err);
  }));
//makes the initial function call, setInterval re-calls function as a cb
widget();
setInterval(widget, 50000);

const margin = {top: 10, right: 30, bottom: 30, left: 50},
  width = 1080 - margin.left - margin.right
  height = 400 - margin.top - margin.bottom

const svg = d3.select('#my_dataviz')
    .append("svg") //adds svg ele
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      
const parseTime = d3.timeParse(`%m/%d`);
const y = d3.scaleLinear().range([height, 0]);
const x = d3.scaleTime().range([0, width]);
// const years = [2014, 2015, 2016, 2017, 2018, 2019, 2020]; 
    //probably not necessary anymore

d3.csv(test)
  .then((data) => {
    data.forEach(d => {
      d.date = parseTime(d.date);
      d.pm25 = d[" pm25"];
      d.year = d[" year"];
  });
  
  
  x.domain(d3.extent(data, (d) => { 
    return d.date;
  }));
  
  y.domain([0, 240]); 
  //use a Math.max(data.)+ some num to round it something instead of 2nd arg
  
  const xaxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b"))); 
    //tickformat debugs calendar
  
  const yaxis = svg.append("g")
  .call(d3.axisLeft(y));

  const sumdat = d3.nest()
    .key( d => {
      // console.log(d)
      return d.year
    })
    .entries(data);
  const years = sumdat.map(d => d.key); //array of years
  
  const colors = d3.scaleOrdinal()
    .domain(years)
    .range(d3.schemeSet2);
    
  const dots = svg.append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
        .attr("r", 2)
        .attr("cx", d => (x(d.date)))
        .attr("cy", d => (y(d.pm25)))
        .style("fill", d => (colors(d.year)));

  const lines = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.pm25))
  svg.selectAll("lines")
    .data([data])
    .enter()
    .append("path")
      .attr("d", d => {
        // console.log(d)
        return lines(d.key)})
      .attr("stroke", d => colors(d.key))
      .style("stroke-width", 5)
      .style("fill", "none")



        // 
  // const lines = svg.selectAll(".line")
  //     .data(sumdat)
  //     .enter()
  //     .append("path")
  //       .attr("fill", "none")
  //       .attr("stroke", d => (colors(years)))
  //       .attr("stroke-width", .3)
  //       .attr("d", d => {
  //         console.log(d)
  //         return d3.line()
  //           .x(d => d.year)
  //           .y(d => d.pm25)
  //           (d.values)
  //       })

  // const pHover = svg
    //   .data([data])
    //   // same thing?
    // // .datum(data)
    //   .append("path")
    //   .attr("fill", "none")
    //   .attr("d", d3.line()
    //     .x((d) => { return x(d.date) })
    //     .y((d) => { return y(d.pm25) })
    //   )
    //   .attr("stroke", "black")
    //   .attr("stroke-width", .3)
    //   .on("mouseover")


    //line legend
    svg
      .selectAll("labels")
      
    });



    // .on("mouseover", function (d) {
    //   d3.select(this).style("fill", d3.select(this).attr('stroke'))
    //     .attr('fill-opacity', 0.3);
    // })
    // .on("mouseout", function (d) {
    //   d3.select(this).style("fill", "none")
    //     .attr('fill-opacity', 1);
    // });
    

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