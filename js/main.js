function enableDeafultButtons(){
    var refreashCurrentBtn = document.querySelector('.square-btn');
    var submitForm = document.querySelector('.wide-btn');

    refreashCurrentBtn.onclick = () => {enableCurrent();}
    submitForm.onclick = () => {
        var newCity = document.querySelector('#search-field').value.trim();
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