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
      //hide that damned key
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
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b"))) 
    //tickformat debugs calendar
    //sets x axis
  
  const yaxis = svg.append("g")
  .call(d3.axisLeft(y));
  // sets y axis

  const aData = d3.nest()
    .key( d => { return d.year.trim() }) //trims empty space
    .entries(data.sort((a ,b) => (a.date - b.date)));
    // groups data into years by issuing a key
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
      // console.log(d) //mouseover data info
      const info = 
      `Year: ${d.year} <br>
      PM25: ${d.pm25} <br>`

      // infoWindow.transition()
        // .duration(2)
      infoWindow.style("opacity", 1)
        .html(infoWindow)
        // .style("left", (d3.e.pageX) + "px")
        // .style("top", (d3.e.pageY) + "px")
        .style("display", "inline-block")
    };

    const hideWindow = () => {
      infoWindow
        // .transition()
        // .duration(200)
        .style("opacity", 0)
    }
  ///////////////////////////

  const line = d3.line()
    .x(d => { return x(d.date)})
    .y(d => { return y(d.pm25)});



    const labels = svg
      .selectAll("labels")
      .data(aData)
      .enter()
      .append("g")
      .append("text")
      // .datum(d => {
      //   return ({
      //   year: d.key,
      //   value: d.values[d.values.length - 1] 
      //   })
      // })
      // ERROR CHECK HERE.
      // .attr("transform", d => { 
      //   // debugger
      //   // console.log(d)
      //   return ("translate(" + x(d.value.pm25) + "," + y(d.value.year) + ")")}) //last value of data point
      // disappears when attr(transform) comes in

  
  const showLine = (e, selectedLine) => {
    // console.log(selectedLine)
    const selected = selectedLine.year.trim()
    
    lines.attr("d", d => {
      // console.log(d)
      if (selected === d.key) {

        labels.attr("x", 12)
          .text(d => { return (selected) })
          // .style("fill", d => { return (colors(d.year)) })
          .style("font-size", 20)
          .attr("cx", (x(selectedLine.date)))
          .attr("cy", (y(selectedLine.pm25)))
        // svg.selectAll("text")
        //   .data([data], d => {
        //     console.log(d)
        //   })
        //   .enter()
        //   .append("t")
        //   .append("text")
        //   .text(selectedLine.pm25)
        //   .attr("cx", (x(selectedLine.date)))
        //   .attr("cy", (y(selectedLine.pm25)))
        //   .text("20198")
        //   .style("font-size", 10)
        //   .attr("font_family", "sans-serif")  // Font type
        //   .attr("font-size", "11px")  // Font size
        //   .attr("fill", "darkgreen");   // Font color
        
        return line(d.values)
      };
        
    })
    .attr("stroke", d => { return colors(d.key) })
    .attr("stroke-width", 3)
    .attr("fill", "none")
    
    
    // dots.attr("g", d => {
    //   if (selectedLine.date === d.date) {
    //     // dot
    //     //   .append("circle")
    //     //   .attr("r", 5) //radius
    //     //   .attr("cx", (x(selectedLine.date)))
    //     //   .attr("cy", (y(selectedLine.pm25)))
    //     //   .style("stroke", "black")
    //     //   //WHY THIS NOT WORK?

      //     svg.selectAll("text")
      //     .append("t")
      //     .append("text")
      //       .text( selectedLine.pm25 )
      //       .attr("x", function (d) {
      //         return x(selectedLine.date);  // Returns scaled location of x
      //       })
      //       .attr("y", function (d) {
      //         return y(selectedLine.pm25);  // Returns scaled circle y
      //       })
      //       .text( "20198" )
      //       .style("font-size", 105)
      // .attr("font_family", "sans-serif")  // Font type
      // .attr("font-size", "11px")  // Font size
      // .attr("fill", "darkgreen");   // Font color
    //   } 
    // })    
  };

  const dot = svg.append("g")
    .selectAll("circle")
    // .data(data, d => {
    //   return {
    //     date: d.date,
    //     pm25: d.pm25,
    //     year: d.year
    //   }
    // })
    .enter()

  const lines = svg.selectAll("lines")
    .data(aData, d => {
      // console.log(d)
    return {
      year: d.key,
      value: d.values
    }})
    .enter()
    .append("path")


    
      
  const dots = svg.append("g")
    .selectAll("dot")
    .data(data, d => {
      return {
        date: d.date,
      }
    })
    .enter()
    .append("circle")
      .attr("r", 2) //radius
      .attr("cx", d => (x(d.date)))
      .attr("cy", d => (y(d.pm25)))
      .style("fill", d => (colors(d.year)))
      .on("mouseover", showLine)
});

