import fetch from "node-fetch"

const apiHit = fetch('https://api.waqi.info/feed/beijing/?token=9c249e12bd6b8b2edc5681e555d3f5454a6488b3')

console.log(apiHit)