
// require('dotenv').config()
const csvSF = "https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco-arkansas%20street%2C%20san%20francisco%2C%20california-air-quality.csv";
let sensorSite = "california/san-francisco/san-francisco-arkansas-street"; //change data here to change code
const data = {};
const test = "https://raw.githubusercontent.com/cowfish813/D3.js/master/csv%20files/san-francisco%2C%20california%2C%20usa-air-quality.csv";
const token = "9c249e12bd6b8b2edc5681e555d3f5454a6488b3"; //how to without jquery/react?
const img = document.createElement('img');

// modal
const modal = document.getElementById("dirModal"); //gets modal
const modalButton = document.getElementById("modalButton"); //button that opens modal
const span = document.getElementsByClassName("close"); //element that closes modal
modalButton.onclick = () =>{ modal.style.display = "block" }; //closes modal on click
span.onclick = () => { modal.style.display = "none" }; //closes modal on x
window.onclick = e => { 
  // debugger
  if (e.target == modal) modal.style.display = "none" };

// cloud shaped widget
const widget = () => (fetch(`https://api.waqi.info/feed/${sensorSite}/?token=${token}`)
  .then(res => (res.json()))
  .then(res => {
    // completes first widget
    if (res) {
      for (let key in res) {
        data[key] = res[key];
      };
      const aqi = data.data.aqi;
      let status = "";
      let color = "";
      let png = ""
      if (aqi > 300) {
          status = "Hazardous";
          color ="8D3D3C";
          png = "6"
        } else if (aqi > 200) {
          status = "Very Unhealthy";
          color ="A83E85";
          png = "5"
        } else if (aqi > 151) {
          status = "Unhealthy";
          color = "E52224";
          png = "4"
        } else if (aqi > 100) {
          status = "USG";
          color = "FA7430";
          png = "3"
        } else if (aqi > 50) {
          status = "Moderate";
          color = "FFDD3B";
          png = "2"
        } else {
          status = "Good";
          color = "D4E4F1";
        // D4E4F1 - white
        // 6ECD4B - green
          png = "1"
        };
        //assembles widget without jank or preloaded elements
            //appends HTML elements to the DOM for efficient loading
        img.src =`./assets/aqi/${png}.png`;
        document.getElementById("aqi_widget").style.backgroundColor = color;
        document.getElementById("title_conditions").innerHTML = "Conditions Today";
        document.getElementById("status").innerHTML = status;
        document.getElementById("aqi").innerHTML = aqi;
        document.getElementById("sensor_site").innerHTML = "Sensor Location:";
        document.getElementById("city").innerHTML = data.data.city.name;
        document.getElementById("widget_icon").appendChild(img);
    } else {
      //hide that damned key
      console.log("API limit exhausted");
    };

    // console.log(res.data.forecast.daily.pm25[0].avg)
  })
  // .then(res => { //forecast
  //   debugger
  //   console.log(res.data.forecast.daily.pm25)
  //   // console.log(res.data.forecast.daily)
  // })
  .catch(err => {
    console.log(err);
  }));
//makes the initial function call, setInterval re-calls function as a cb
widget();
setInterval(widget, 5000);

const margin = {top: 10, right: 30, bottom: 30, left: 50},
  width = 1040 - margin.left - margin.right
  height = 500 - margin.top - margin.bottom

const svg = d3.select('#my_dataviz') //adds svg obj to page
    .append("svg") //adds svg ele
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
const parseTime = d3.timeParse(`%m/%d`);
const y = d3.scaleLinear().range([height, 0]);
const x = d3.scaleTime().range([0, width]);
const compare = {};
const dotCompare = {};

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
  
  const xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b"))) 
    //tickformat debugs calendar
    //sets x axis
  
  const yAxis = svg.append("g")
  .call(d3.axisLeft(y));
  // sets y axis

  const yAxisLabel = svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Particulate Matter (PM2.5)")

  const xAxisLabel = svg.append("text") //adjust location of xaxis
    .attr("transform", "translate(" + (width/2) + "," + (height = margin.top + 490) + ")")
    .style("text-anchor", "middle")
    .text("Month")

  //sorts data and adds a new key
  const aData = d3.nest()
    .key( d => { return d.year.trim() }) //trims empty space
    .entries(data.sort((a ,b) => (a.date - b.date)));
    // groups data into years by issuing a key
  const years = aData.map(d => d.key); //array of years
  
  const colors = d3.scaleOrdinal()
    .domain(years)
    .range(d3.schemeSet2);

  // line compare, utilizes initialized compare object
  const line = d3.line()
    .x(d => { return x(d.date)})
    .y(d => { return y(d.pm25)});

  const labels = svg
    .selectAll("labels")
    .data(aData)
    .enter()
    .append("g")
    .append("text");

  const showCompare = (e, d) => {
    const year = d.year.trim();
      if (compare[year]) {
        compare[year] = false;
      } else {
        compare[year] = d;
      };
  }; //fxn loads an object for better efficiency

  //hover over dots/graph
  const showLine = (e, selectedLine) => { 
    const hoveredYear = selectedLine.year.trim();
    const pm25 = selectedLine.pm25;

    lines.attr("d", d => {
      if (hoveredYear === d.key) {
        labels.attr("x", 12)
          .text(d => { return (`PM25: ${pm25}`) })
          .style("font-family", "Helvetica Neue, Helvetica, sans-serif")
          .style("font-size", "15")
          // .style("z-index", "10")
          .style("opacity", "1") //need to make text appear OVER dots
          .attr("transform",
            ("translate(" + x(selectedLine.date) + "," + y(selectedLine.pm25) + ")")
          );
        return line(d.values);
      }
      if (compare[d.key]) {
        return line(d.values); // from handleclick
      }
    })
    .attr("stroke", d => { return colors(d.key) })
  };

  const lines = svg.selectAll("lines")
    .data(aData)
    .enter()
    .append("path")
    .attr('opacity', '1')
    .attr("stroke-width", 2)
    .attr("fill", "none");

      // RE-ENABLE FOR PRODUCTION CODE
  const dots = svg.append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .on("click", showCompare)
    .on("mouseover", showLine)
    .attr("r", 5) //radius
    .attr("cx", d => {
      return (x(d.date))})
    .attr("cy", d => (y(d.pm25)))
    .attr('opacity', '.2')
    .style("fill", d => (colors(d.year)))

// WORKING ON INDIVIDUAL DOTS HERE. TURN THEM OFF VIA YEAR
  // const dots = svg.append("g")
  //   .selectAll("dot")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //   .on("click", showCompare)
  //   .on("mouseover", showLine)
  //   .attr("r", 5) //radius
  //   .attr("cx", d => {
  //     // debugger
  //     return (x(d.date))})
  //   .attr("cy", d => (y(d.pm25)))
  //   .attr('opacity', '0')
  //   .style("fill", d => (colors(d.year)))

  //   //dot buttons
  // const dotButtonsCompare = (e, d) => {
  //   const year = e.key;
  //   if (dotCompare[year]) {
  //     dotCompare[year] = false;
  //   } else {
  //     dotCompare[year] = e;
  //   };
  //   // debugger
  //   if (dotCompare[year] === d[" year"]) {
  //     dots
  //       .attr("cx", d => {
  //         // debugger
  //         return (x(d.date))
  //       })
  //       .attr("cy", d => (y(d.pm25)))
  //       .attr('opacity', '0')
  //       .style("fill", d => (colors(d.year)))
  //   }
  // };

  // const dotButtons = d3.select("h3")
  //   .selectAll("input")
  //   .data(aData)
  //   .enter()
  //   .append("input")
  //   .attr("type", "button")
  //   .attr("class", "babyCloud")
  //   .attr("value", d => { return d.key })
  //   .sort((a, b) => { return a.key - b.key }) //buttons are ordered this way
  //   .on("click", dotButtonsCompare);
  
  


  // buttom compare, still uses the same compare object initialized earlier
  const buttonCompare = (e, d) => { 
    const year = e.key
    if (compare[year]) {
      compare[year] = false;
    } else {
      compare[year] = e;
    };

    lines.attr("d", d => { 
      if (compare[d.key]) {
        return line(d.values); // from handleclick
      };
    })
      .attr("stroke", d => { return colors(d.key) });
  };

  const buttons = d3.select("h2")
    .selectAll("input")
    .data(aData)
    .enter()
    .append("input")
      .attr("type", "button")
      .attr("class", "babyCloud")
      .attr("value", d => { return d.key })
    .sort((a, b) => { return a.key - b.key }) //buttons are ordered this way
    .on("click", buttonCompare);


  // zooming
  const clip = svg
    .append("defs")
    .append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);
  
  const updateChart = () => {
    //recover new scale
    const newX = d3.event.transform.rescaleX(x);
    const newY = d3.event.transform.rescaleY(y);
    
    //update scale
    xAxis.call(d3.axisBottom(newX));
    yAxis.call(d3.axisLeft(newY));
    
    //update position
    dots.selectAll("dot")
      .attr("cx", d => { return newX(d.date) })
      .attr("cy", d => { return newY(d.pm25) });
  };
  
  const zoom = d3.zoom()
    .scaleExtent([1, 10]) //
    .extent([[0, 0], [width, height]])
    .on("zoom", updateChart);

  const recoverPoint = svg
    .append("rect")
    // .attr("width", width) //why this no work!?
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);
});

