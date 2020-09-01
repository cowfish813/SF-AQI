// const sfURL = './js db/SanFranciscoCA.json';
// const settings = { method: 'GET' };
// // fetch(sfURL, settings)
// //     .then(res => res.json())
// //     console.log(res)
// https.get(url, (res) => {
//     let body = "";

//     res.on("data", (chunk) => {
//         body += chunk;
//     });

//     res.on("end", () => {
//         try {
//             let json = JSON.parse(body);
//         } catch (error) {
//             console.log(error.message)
//         };
//     }).on("error", (error) => {
//         console.error(error.message);
//     })
// })

// let myData = require('./SanFranciscoCA.json')
// console.log(myData[0])


// function load() {
//     let aqi = JSON.parse(dataSF);
//     console.log(aqi[0]);
// }
// load();

// function loadJSON(cb) {
//     let sfaqi = new XMLHttpRequest();
//     sfaqi.overrideMimeType("application.json");
//     sfaqi.open("GET", "./js db/SanFranciscoCA.json");
//     sfaqi.onreadystatechange = function () {
//         if (sfaqi.readyState == 4 && sfaqi.status == "200") {
//             cb(JSON.parse(sfaqi.responseText));
//         }
//     }
//     sfaqi.send(null)
// }

// loadJSON(function(db) {
//     console.log(db)
// });
// console.log(loadJSON(db))



// // const sfURL = './js db/SanFranciscoCA.json';
// // let http = require('http');


