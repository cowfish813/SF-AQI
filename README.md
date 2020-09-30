**HELLO WORLD**

live site

With the recent wildfires and other contributing factors to global warming, I found myself spending a lot more time on places like Purpleair.com. 
I built this app with a curiosity on how our changing climate is affecting how we live in the bay area and California as a whole and to have a webpage run necessary information to me that would not tax a slow computer's CPU.

These events are not normal and I wanted to visualize it over the years as well as track live readings of San Francisco's AQI as provided by https://aqicn.org and their sensors across the city. Each Sensor has a different API endpoint that are utilized with a secret token as follows.
```
`https://api.waqi.info/feed/${Sensor Location}`/?token={Unique Token ID}
```

The functional components involved with making the live update are utilized as follows
```
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
```

"fetch" returns a promise that I can extract additonal data from including forecasts, current AQI and its associated information like ozone, PM2.5, PM10, bugs, and sensor location. I constructed the functional widget entirely with CSS and promises for smoother load times. The application is able to call this function every 5 minutes and update without having to reload the widget or entire webpage.




Future additions
    * AQI forecasts

* Utilizes D3.js to 