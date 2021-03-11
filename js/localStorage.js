  
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
    }, delay);
}

async function create_card(CityName){
    const template = document.querySelector('#pinned-card-template');

    let place_params = report2Params(template.content.querySelector('.weather-report'));
    place_params['temp'] = template.content.querySelector('p');
    place_params['icon'] = template.content.querySelector('img');
    place_params['template'] = template;
    place_params['city'] = template.content.querySelector('h3');
    
    try {
        await fillReport(CityName, place_params);
    } catch (err) {
        throw err;
    }
    
    const pinned_list = document.querySelector('.pinned-list');
    let clone = template.content.querySelector('li').cloneNode(true);

    pinned_list.appendChild(clone);
    clone.querySelector('button').onclick = () => {
        pinned_list.removeChild(clone);

        let pinnedCities = new Set(JSON.parse(localStorage['cities']))
        pinnedCities.delete(CityName);
        localStorage['cities'] = JSON.stringify([...pinnedCities]);

        if([...pinnedCities].length === 0){
            document.querySelector('.pinned-empty').style.display = 'block';
        }
    }
}

function load_pinned(){
    const parent = document.querySelectorAll('section')[1];
    const pinnedList = document.querySelector('.pinned-list');

    loadData(parent, pinnedList, async () => {
        let set = new Set(JSON.parse(localStorage['cities']));
        const data = [...set];
        for (let i = 0; i < data.length; i++) {
            try {
                await create_card(data[i]);
            } catch (err) {
                window.alert(err);
                set.delete(data[i]);
            }   
        }
        localStorage['cities'] = JSON.stringify([...set]);

        if (JSON.parse(localStorage['cities']).length === 0){
            document.querySelector('.pinned-empty').style.display = 'block';
        }
    }, 1000);
}