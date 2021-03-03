function init_storage(){
    var default_cities = ['Moscow', 'Kaliningrad', 'Omsk', 'Saint-Petersburg', 'Ekaterinburg'];

    if (localStorage.getItem('cities') === null){
        localStorage['cities'] = JSON.stringify(default_cities);
    }
    if (localStorage.getItem('default-city') === null) localStorage['default-city'] = 'Moscow';
}

function update_cities(cities_set){
    localStorage['cities'] = JSON.stringify([...cities_set]);
}

async function create_card(CityName){
    var template = document.querySelector('#pinned-card-template');

    // template.content.querySelector('h3').textContent = CityName;
    var place_params = report2Params(template.content.querySelector('.weather-report'));
    place_params['temp'] = template.content.querySelector('p');
    place_params['icon'] = template.content.querySelector('img');
    place_params['template'] = template;
    place_params['city'] = template.content.querySelector('h3');

    await fillReport(CityName, place_params);
    var pinned_list = document.querySelector('.pinned-list');
    var clone = document.importNode(place_params['template'].content, true);
    console.log(clone.content);
    pinned_list.appendChild(clone);
}

async function load_pinned(set){
    set.forEach(async function (value){
        await create_card(value);
    });
}

init_storage()
var arr = new Set(JSON.parse(localStorage['cities']));
console.log(arr)
load_pinned(arr);