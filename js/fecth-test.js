const queryPattern = "https://weatherapi-com.p.rapidapi.com/forecast.json?q=";
const rapidapiKey =  "5ea1a7bba0mshb4b5ef34560e186p1b62cbjsn45061317a9f6";
const rapidapiHost = "weatherapi-com.p.rapidapi.com";


// Get API response
async function getWeatherJSON(cityOrCoords){
    const query = queryPattern + cityOrCoords;
    let response = await fetch(query, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": rapidapiKey,
            "x-rapidapi-host": rapidapiHost
        }
    });
    return [await response.json(), response.status];
}

// Fill weather report block
function convertDir(dir){
    const dirs = {"N":"North", "W":"West", "E":"East", "S":"South"}
    let result = '';
    for (let i = 0; i < dir.length; i++) {
        result += dirs[dir[i]];
        if (i === 0 && dir.length > 1) result += '-'
    }
    return result;
}

async function fillReport(cityOrCoords, reportFields){
    const [weather, status] = await getWeatherJSON(cityOrCoords);
    if (status === 200){
        const current = weather['current'];
        const location = weather['location'];

        let temp = current['temp_c'];
        temp = temp.indexOf('.') === -1 ? temp : temp.substring(0,  temp.indexOf('.'));
        console.log(temp);
        reportFields['temp'].textContent = temp + '°C';
        reportFields['wind'].textContent = current['wind_mph'] + ' m/s, ' + convertDir(current['wind_dir']);
        reportFields['cloud'].textContent = current['cloud'] + ' %';
        reportFields['press'].textContent = current['pressure_mb'] + ' hpa';
        reportFields['humidity'].textContent = current['humidity'] + ' %';
        reportFields['coords'].textContent = '[ ' + location['lat'] + ', ' + location['lon'] + ' ]';
        reportFields['icon'].src = current['condition']['icon'].replace(/64x64/i, '128x128');

        if(reportFields['city'] !== undefined) reportFields['city'].textContent = location['name'];
    }
    else{
        throw "City " + cityOrCoords + " hasn't been found";
    }
    
}

function report2Params(weatherReportList){
    const keys = ['wind', 'cloud', 'press', 'humidity', 'coords'];
    const items = weatherReportList.querySelectorAll('p');
    let params = {}
    for (let i = 0; i < keys.length; i++) {
        params[keys[i]] = items[i];
    }
    return params;
}

// Enable methods (can be useless)
function enableCurrent(){

    const parentNode = document.querySelectorAll('section')[0];
    const loadingNode = document.getElementsByClassName('current-position')[0];
    loadData(parentNode, loadingNode, () => {
        let params = report2Params(document.querySelector('.weather-report'));
        params['temp'] = document.querySelector('p');
        params['icon'] = document.querySelector('.wi');
        params['city'] = document.querySelector('.place-current');

        navigator.geolocation.getCurrentPosition(async (position) => {
            const query = position.coords.latitude + ',' + position.coords.longitude;
            await fillReport(query, params);
        }, async () => { await fillReport(defaultCity, params)})
    }, 500);
}