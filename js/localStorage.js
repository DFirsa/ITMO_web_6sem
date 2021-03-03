function init_storage(){
    var default_cities = ['Moscow', 'Kaliningrad', 'Omsk', 'Saint-Petersburg', 'Ekaterinburg'];

    if (localStorage.getItem('cities') === null){
        localStorage['cities'] = JSON.stringify(default_cities);
    }
    if (localStorage.getItem('default-city') === null) localStorage['default-city'] = 'Moscow';
}

async function create_card(CityName){
    var template = document.querySelector('#pinned-card-template');

    var place_params = report2Params(template.content.querySelector('.weather-report'));
    place_params['temp'] = template.content.querySelector('p');
    place_params['icon'] = template.content.querySelector('img');
    place_params['template'] = template;
    place_params['city'] = template.content.querySelector('h3');

    await fillReport(CityName, place_params);
    var pinned_list = document.querySelector('.pinned-list');
    var clone = template.content.querySelector('li').cloneNode(true);

    pinned_list.appendChild(clone);
    clone.querySelector('button').onclick = function (){
        pinned_list.removeChild(clone);

        let pinnedCities = new Set(JSON.parse(localStorage['cities']))
        pinnedCities.delete(CityName);
        localStorage['cities'] = JSON.stringify([...pinnedCities]);
    }
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