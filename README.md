HELLO WORLD

With the recent wildfires and other contributing factors to global warming, I found myself spending a lot more time on places like Purpleair.com. 
I built this app with a curiosity on how our changing climate is affecting how we live in the bay area and California as a whole and to have a webpage run necessary information to me that would not tax a slow computer's CPU.


These events are not normal and I wanted to visualize it over the years as well as track live readings of San Francisco's AQI as provided by https://aqicn.org and their sensors across the city. Each Sensor has a different API endpoint that are utilized with a secret token as follows.
* that code snippet

"fetch" returns a promise that I can extract additonal data from including forecasts, current AQI and its associated information like ozone, PM2.5, PM10, bugs, and sensor location. I constructed the functional widget entirely with CSS and promises for smoother load times. The application is able to call this function every 5 minutes and update without having to reload the entire widget.




Future additions
    * AQI forecasts

* Utilizes D3.js to 