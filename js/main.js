

function convert_dir(dir){
    var dirs = {"N":"North", "W":"West", "E":"East", "S":"South"}
    var result = '';
    for (let i = 0; i < dir.length; i++) {
        result += dirs[dir[i]];
        if (i === 0 && dir.length > 1) result += '-'
    }
    return result;
}

function fill_weather_report(params, response){
    const current = response['current'];
    const loc = response['location'];

    params['temp'].textContent = current['temp_c'] + "°C";
    params['wind'].textContent = current['wind_mph'] + ' m/s, ' + convert_dir(current['wind_dir']);
    params['cloud'].textContent = current['cloud'] + "%";
    params['press'].textContent = current['pressure_mb'] + ' hpa';
    params['humidity'].textContent = current['humidity'] + '%';
    params['coords'].textContent = '[ ' + loc['lat'] + ', ' + loc['lon'] + ' ]';

    if(params['city'] !== undefined) params['city'].textContent = loc['name'];
    var icon_src = current['condition']['icon'].replace(/64x64/i, '128x128');
    params['icon'].src = icon_src;
}

const rapidapiKey = "5ea1a7bba0mshb4b5ef34560e186p1b62cbjsn45061317a9f6";
const rapidapiHost = "weatherapi-com.p.rapidapi.com";
const pattern = "https://weatherapi-com.p.rapidapi.com/forecast.json?q=";
const default_city = "Moscow";

function getWeather(requestText, params){
    var request = new XMLHttpRequest();
    request.open("GET", pattern + requestText);

    request.setRequestHeader("x-rapidapi-key", rapidapiKey);
    request.setRequestHeader("x-rapidapi-host", rapidapiHost);
    request.responseType = 'json';

    request.onload = function () {
        fill_weather_report(params, request.response);
    }

    request.send();
}

function upd_current(){
    navigator.geolocation.getCurrentPosition(function (position){
        var query = position.coords.latitude + ',' + position.coords.longitude;
        getWeather(query, current_place_params);
    }, function (){
        getWeather(default_city, current_place_params);
    });
}

var current_place_params = {}
current_place_params['temp'] = document.getElementById('current-temp');
current_place_params['wind'] = document.getElementById('current-wind');
current_place_params['cloud'] = document.getElementById('current-clouds');
current_place_params['press'] = document.getElementById('current-press');
current_place_params['humidity'] = document.getElementById('current-humidity');
current_place_params['coords'] = document.getElementById('current-coords');
current_place_params['city'] = document.getElementsByClassName('place-current')[0];
current_place_params['icon'] = document.getElementById('current-icon');

function show_preloader(preloader, layout_block){
    layout_block.style.display = "none";
    preloader.style.display = "block";
}

function hide_preloader(preloader, layout_block){
    preloader.style.display = "none";
    layout_block.style.display = "block";
}

document.getElementsByClassName('square-btn')[0].onclick = function (){
    upd_current();
}

upd_current();
// getWeather("Saint-Petersburg", current_place_params);
