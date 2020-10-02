// require('dotenv').config()
const csvSF = "https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco-arkansas%20street%2C%20san%20francisco%2C%20california-air-quality.csv";
let sensorSite = "california/san-francisco/san-francisco-arkansas-street";
const data = {};
const test = "https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco%2C%20california%2C%20usa-air-quality.csv";
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
      let color = "";
      if (aqi > 300) {
          status = "Hazardous";
          color ="brown";
        } else if (aqi > 200) {
          status = "Very Unhealthy";
          color ="puple";
        } else if (aqi > 151) {
          status = "Unhealthy";
          color = "red";
        } else if (aqi > 100) {
          status = "USG";
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
  height = 500 - margin.top - margin.bottom

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
  
  //use a Math.max(data.)+ some num to round it something instead of 2nd arg
    x.domain(d3.extent(data, (d) => { 
      return d.date;
    }));
    
    y.domain([0, 240]); 
  
  const xaxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b"))); 
    //tickformat debugs calendar
  
  const yaxis = svg.append("g")
  .call(d3.axisLeft(y));

  const aData = d3.nest()
    .key( d => { return d.year })
    .entries(data.sort((a ,b) => (a.date - b.date)));
  const years = aData.map(d => d.key); //array of years
  
  const colors = d3.scaleOrdinal()
    .domain(years)
    .range(d3.schemeSet2);
    
/////////////////////
    // dot mouseover events

    const infoWindow = d3.select("g")
      .append("div")
      .attr("class", "window")
      .style("background-color", "black")
      .style("padding", "2rem")
      .style("color", "black")

    const showInfo = (e, d) => {
      console.log(d) //mouseover info
      const info = `Year: ${d.year} <br>`

      infoWindow.transition()
        .duration(2)
      infoWindow.style("opacity", 1)
        .html(infoWindow)
        // .style("left", (d3.event.pageX) + "px")
        // .style("left", (d3.event.pageY) + "px")
        .style("display", "inline-block")
    };

    const hideWindow = () => {
      infoWindow
        .transition()
        .duration(200)
        .style("opacity", 0)
    }
  ///////////////////////////
  const dots = svg.append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
        .attr("r", 2)
        .attr("cx", d => (x(d.date)))
        .attr("cy", d => (y(d.pm25)))
        .style("fill", d => (colors(d.year)))
    .on("mouseover", showInfo)
    .on("mouseleave", hideWindow)



  const line = d3.line()
                  .x(d => { return x(d.date)})
                  .y(d => { return y(d.pm25)});

  const lines = svg.selectAll("lines")
    .data(aData, d => {
          return {
          year: d.key,
          value: d.values
    }})
    .enter()
    .append("path")
    .attr("d", d => {
      return line(d.values)
    })
    .attr("stroke", d => {
      return colors(d.key)
    })
    .attr("stroke-width", 1.5)
    .attr("fill", "none")
    

    //line legend
    //legend probably can't be drawn unless i redo lines
    //Label works but it cant be utilized properly. can't move it!
  // const labels = svg
  //   .selectAll("labels")
  //   .data(aData)
  //   .enter()
  //     .append("g")
  //     .append("text")
  //       .datum(d => {
  //         return ({
  //         year: d.key,
  //         value: d.values[d.values.length - 1] 
  //         })
  //       })
  //       // ERROR CHECK HERE.
  //       // .attr("transform", d => { 
  //       //   // debugger
  //       //   // console.log(d)
  //       //   return ("translate(" + x(d.value.pm25) + "," + y(d.value.year) + ")")}) //last value of data point
  //        // disappears when attr(transform) comes in
  //       .attr("x", 12)
  //       .text(d => { return (d.year)})
  //       .style("fill", d => {return (colors(d.year))})
  //       .style("font-size", 20);



});

