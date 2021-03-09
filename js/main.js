function enableDeafultButtons(){
    const refreashCurrentBtn = document.querySelector('.square-btn');
    const submitForm = document.querySelector('.wide-btn');

    refreashCurrentBtn.onclick = () => {enableCurrent();}
    submitForm.onclick = () => {
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

// ============ TODO: ==============
// - показывать надпись тип здесь ничего нет при отсутствии пинов
// - если город неверный запрос к апи сломается
// - подсказки при вводе наверно, было бы прикольно
// - лоадеры