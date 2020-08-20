// console.log(d3)

const fake = [
    {id: 'd1', value: 10, region: 'USA'},
    {id: 'd2', value: 11, region: 'SA'},
    {id: 'd3', value: 12, region: 'US'},
    {id: 'd4', value: 6, region: 'U23542'},
    // {id: 'd5', value: 15, region: 'US1231A'},
    // {id: 'd6', value: 12, region: 'U12312SA'},
    // {id: 'd7', value: 6, region: 'US123A'},
];

const xScale = d3.scaleBand().domain(fake.map(dataPoint => dataPoint.region)).rangeRound([0,250]).padding(0.1);
//ordinal scale, all of them uniform
const yScale = d3.scaleLinear().domain([0, 15]).range([200, 0]);
//gives us different values to translate vals to other num


// d3.select('div') //the class div or whatever
//     .selectAll('p') //all paragraphgs
//     .data(fake) //can be araray or full of strings //binds data
//     .enter() //which are missing?
//     .append('p') //appends p for all missing
//     .text( dta => dta.region) //dta gives access to each data node
//     // .selectAll();

const container = d3.select('svg')
        .classed('container', true) //gives it a class name
        // .style('border', '1px solid red');

const bars = container
    .selectAll('.bar')
    .data(fake)
    .enter()
    .append('rect') //valid ele
    .classed('bar', true)
    .text(d => d)
    .attr('width', xScale.bandwidth())
    .attr('height', data => 200 - yScale(data.value))
    .attr('x', data => xScale(data.region))
    .attr('y', data => yScale(data.value))

// setTimeout(() => {
//     bars.data(fake.slice(0, 2)).exit().remove();
// }, 2000)