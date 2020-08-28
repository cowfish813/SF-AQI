// // console.log(d3)

const sfURL = './js db/SanFranciscoCA.json';
const settings = { method: 'GET' };
// fetch(sfURL, settings)
//     .then(res => res.json())
//     console.log(res)
https.get(url, (res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            let json = JSON.parse(body);
        } catch(error) {
            console.log(error.message)
        };
    }).on("error", (error) => {
        console.error(error.message);
    })
})

const xScale = d3.scaleBand().domain(sfaqi.map(dataPoint => dataPoint.date)).rangeRound([0,250]).padding(0.1);
//ordinal scale, all of them uniform
const yScale = d3.scaleLinear().domain([0, 15]).range([200, 0]);
//gives us different values to translate vals to other num



const container = d3.select('svg')
        .classed('container', true) //gives it a class name
        // .style('border', '1px solid red');

const bars = container
    .selectAll('.bar')
    .data(sfaqi)
    .enter()
    .append('rect') //valid ele
    .classed('bar', true)
    .text(d => d)
    .attr('width', xScale.bandwidth())
    .attr('height', data => 200 - yScale(data.pm25))
    .attr('x', data => xScale(data.date))
    .attr('y', data => yScale(data.pm25))

// setTimeout(() => {
//     bars.data(fake.slice(0, 2)).exit().remove();
// }, 2000)

// const text = bars.selectAll('text')
//     .data(fake)
//     .enter()
//     .append("text")
//     .text(d =>( d.region))
//     // .attr('x', data => xScale -)
//     // .attr('y', data => )



// // d3.select('div') //the class div or whatever
// //     .selectAll('p') //all paragraphgs
// //     .data(fake) //can be araray or full of strings //binds data
// //     .enter() //which are missing?
// //     .append('p') //appends p for all missing
// //     .text( dta => dta.region) //dta gives access to each data node
// //     // .selectAll();

// const fake = [
//     {id: 'd1', value: 10, region: 'USA'},
//     {id: 'd2', value: 11, region: 'SA'},
//     {id: 'd3', value: 12, region: 'US'},
//     {id: 'd4', value: 6, region: 'U23542'},
//     {id: 'd5', value: 15, region: 'US1231A'},
//     {id: 'd6', value: 12, region: 'U12312SA'},
//     {id: 'd7', value: 6, region: 'US123A'},
// ];

// import sfaqi from './js db/SanFranciscoCA.json';
// import beijing from './js db/beijing-air-quality.json';
// import paris from './js db/paris-air-quality.json';
// const fetch = require('node-fetch');