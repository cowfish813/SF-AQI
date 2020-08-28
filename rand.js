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
        } catch (error) {
            console.log(error.message)
        };
    }).on("error", (error) => {
        console.error(error.message);
    })
})