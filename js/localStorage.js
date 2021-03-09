  
function init_storage(){
    const default_cities = ['Moscow', 'Kaliningrad', 'Omsk', 'Saint-Petersburg', 'Ekaterinburg'];

    if (localStorage.getItem('cities') === null){
        localStorage['cities'] = JSON.stringify(default_cities);
    }
    if (localStorage.getItem('default-city') === null) localStorage['default-city'] = 'Moscow';
}

function loadData(parentNode, loadingNode, loadFunction, delay){
    const defaultValue = loadingNode.style.display;
    loadingNode.style.display = 'none';
    const loader = document.getElementById('loader').content.cloneNode(true);
    parentNode.appendChild(loader);
    
    setTimeout(async () => {
        await loadFunction();
        parentNode.removeChild(parentNode.querySelector('.loader'));
        loadingNode.style.display = defaultValue;

        //TODO: плавная анимация
    }, delay);
}

async function create_card(CityName){
    const template = document.querySelector('#pinned-card-template');

    let place_params = report2Params(template.content.querySelector('.weather-report'));
    place_params['temp'] = template.content.querySelector('p');
    place_params['icon'] = template.content.querySelector('img');
    place_params['template'] = template;
    place_params['city'] = template.content.querySelector('h3');

    await fillReport(CityName, place_params);
    const pinned_list = document.querySelector('.pinned-list');
    let clone = template.content.querySelector('li').cloneNode(true);

    pinned_list.appendChild(clone);
    clone.querySelector('button').onclick = function (){
        pinned_list.removeChild(clone);

        let pinnedCities = new Set(JSON.parse(localStorage['cities']))
        pinnedCities.delete(CityName);
        localStorage['cities'] = JSON.stringify([...pinnedCities]);
    }
}

function load_pinned(){
    const parent = document.querySelectorAll('section')[1];
    const pinnedList = document.querySelector('.pinned-list');
    loadData(parent, pinnedList, async () => {
        let set = new Set(JSON.parse(localStorage['cities']));
        set.forEach(async (value) => {await create_card(value)});
    }, 1000)
}