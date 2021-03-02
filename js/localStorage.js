// default cities:
//     > Moscow
//     > Kalinigrad
//     > Omsk
//     > Saint-Petersburg
//     > Ekaterinburg

function init_storage(){
    var default_cities = ['Moscow', 'Kallinigrad', 'Omsk', 'Saint-Petersburg', 'Ekaterinburg'];

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
    template.content.querySelector('h3').textContent = CityName;
    items = template.content.querySelectorAll('p');

    var place_params = {}
    place_params['temp'] = items[0];
    place_params['wind'] = items[1];
    place_params['cloud'] = items[2];
    place_params['press'] = items[3];
    place_params['humidity'] = items[4];
    place_params['coords'] = items[5];
    place_params['icon'] = template.content.querySelector('img');
    place_params['template'] = template;

    await fillReport(CityName, place_params);
    var pinned_list = document.querySelector('.pinned-list');
    var clone = document.importNode(place_params['template'].content, true);
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