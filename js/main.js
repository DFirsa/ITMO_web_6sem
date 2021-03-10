function enableDeafultButtons(){
    const refreashCurrentBtn = document.querySelector('.square-btn');
    refreashCurrentBtn.onclick = () => {enableCurrent();}

    const form = document.querySelector('form');
    form.onsubmit = () => {
        const newCity = document.querySelector('#search-field').value.trim();
        if(newCity !== ""){
            let pinnedCities = new Set(JSON.parse(localStorage['cities']))
            pinnedCities.add(newCity);
            localStorage['cities'] = JSON.stringify([...pinnedCities]);
        }
    }
}

init_storage();
enableCurrent();
load_pinned();
enableDeafultButtons();

// TODO: заглушку если все пины удалены
// TODO: мб подсказки при вводе