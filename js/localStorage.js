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

function create_card(Set){
    
}

init_storage()
var arr = new Set(JSON.parse(localStorage['cities']));
console.log(arr)

