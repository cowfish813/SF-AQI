// require('dotenv').config()
const csvSF = "https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco-arkansas%20street%2C%20san%20francisco%2C%20california-air-quality.csv";
let sensorSite = "california/san-francisco/san-francisco-arkansas-street";
const data = {};

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
      if (aqi > 300) {
          status = "Hazardous";
          document.getElementById("aqi_widget").style.backgroundColor ="brown";
        } else if (aqi > 200) {
          status = "Very Unhealthy";
          document.getElementById("aqi_widget").style.backgroundColor ="puple";
        } else if (aqi > 151) {
          status = "Unhealthy";
          document.getElementById("aqi_widget").style.backgroundColor = "red";
        } else if (aqi > 150) {
          status = "Unhealthy for Sensitive Groups";
          document.getElementById("aqi_widget").style.backgroundColor = "orange";
        } else if (aqi > 50) {
          status = "Moderate";
          document.getElementById("aqi_widget").style.backgroundColor = "yellow";
        } else {
          status = "Good";
          document.getElementById("aqi_widget").style.backgroundColor = "greenyellow";
        }
        //assembles widget without jank or preloaded elements
            //appends HTML elements to the DOM for efficient loading
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
console.log(data);



const margin = {top: 10, right: 30, bottom: 30, left: 50},
  width = 1080 - margin.left - margin.right
  height = 400 - margin.top - margin.bottom

const svg = d3.select('#my_dataviz')
    .append("svg") //adds svg ele
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//manipulate year/month/etc
const parseTime = d3.timeParse("%Y/%m/%d");

const x = d3.scaleTime().range([0, width]);
  // .domain(d3.extent(data, (d) => { return d.date; })) //no data yet, append later?
  
const y = d3.scaleLinear().range([height, 0]);
  // .domain([0, 240]) //use a Math.max(data.)something instead of 2nd arg
  
d3.csv(csvSF).then((data) => {
  data.forEach(d => {
    d.date = parseTime(d.date);
    d.pm25 = d[" pm25"];
  });

  x.domain(d3.extent(data, (d) => { 
    // console.log(d)
    return d.date;
  }));
  // x.domain(data.map((d) => d.date))
  console.log()
    //domain *sets input domain
  //extent calls min and max of the array
    //set x axis for month?
        //find a way to key into month?


  // x.domain(myData)
  y.domain([0, 240]); //use a Math.max(data.)something instead of 2nd arg
  
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));
  
  svg.append("g")
  .call(d3.axisLeft(y))
  

  svg.selectAll("dot")
    .data(data)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", d => (x(d.date)))
      .attr("cy", d => (y(d.pm25)))
      .attr("fill", "#69b3a2") //color



  // Add the line
        //later on, set for hover on dots
  const pHover = svg
    .data([data])
    // same thing?
  // .datum(data)
    .append("path")
    .attr("fill", "none")
    .attr("d", d3.line()
      .x((d) => { return x(d.date) })
      .y((d) => { return y(d.pm25) })
    )
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    // .on("mouseover", function (d) {
    //   d3.select(this).style("fill", d3.select(this).attr('stroke'))
    //     .attr('fill-opacity', 0.3);
    // })
    // .on("mouseout", function (d) {
    //   d3.select(this).style("fill", "none")
    //     .attr('fill-opacity', 1);
    // });



    //add point
        //later on => color the dots based on severity
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