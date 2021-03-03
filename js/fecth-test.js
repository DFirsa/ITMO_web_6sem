const queryPattern = "https://weatherapi-com.p.rapidapi.com/forecast.json?q=";
const rapidapiKey =  "5ea1a7bba0mshb4b5ef34560e186p1b62cbjsn45061317a9f6";
const rapidapiHost = "weatherapi-com.p.rapidapi.com";
const defaultCity = localStorage['default-city'];

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

    return await response.json();
}

// Fill weather report block
function convertDir(dir){
    var dirs = {"N":"North", "W":"West", "E":"East", "S":"South"}
    var result = '';
    for (let i = 0; i < dir.length; i++) {
        result += dirs[dir[i]];
        if (i === 0 && dir.length > 1) result += '-'
    }
    return result;
}

async function fillReport(cityOrCoords, reportFields){
    let weather = await getWeatherJSON(cityOrCoords);
    let current = weather['current'];
    let location = weather['location'];

    reportFields['temp'].textContent = current['temp_c'] + '°C';
    reportFields['wind'].textContent = current['wind_mph'] + ' m/s, ' + convertDir(current['wind_dir']);
    reportFields['cloud'].textContent = current['cloud'] + ' %';
    reportFields['press'].textContent = current['pressure_mb'] + ' hpa';
    reportFields['humidity'].textContent = current['humidity'] + ' %';
    reportFields['coords'].textContent = '[ ' + location['lat'] + ', ' + location['lon'] + ' ]';
    reportFields['icon'].src = current['condition']['icon'].replace(/64x64/i, '128x128');

    if(reportFields['city'] !== undefined) reportFields['city'].textContent = location['name'];
}

function report2Params(weatherReportList){
    var params = {}
    items = weatherReportList.querySelectorAll('p');
    params['cloud'] = items[1];
    params['wind'] = items[0];
    params['press'] = items[2];
    params['humidity'] = items[3];
    params['coords'] = items[4];

    return params;
}

// Enable methods (can be useless)
async function enableCurrent(){

    var params = report2Params(document.querySelector('.weather-report'));
    params['temp'] = document.querySelector('p');
    params['icon'] = document.querySelector('.wi');
    params['city'] = document.querySelector('.place-current');

    navigator.geolocation.getCurrentPosition(async (position) => {
        var query = position.coords.latitude + ',' + position.coords.longitude;
        await fillReport(query, params);
    }, async () => { await fillReport(defaultCity, params)})
}

enableCurrent();