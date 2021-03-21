// convert report html to js object
function report2Params(weatherReportList) {
  const keys = ['wind', 'cloud', 'press', 'humidity', 'coords'];
  const items = weatherReportList.querySelectorAll('p');
  const params = {};
  for (let i = 0; i < keys.length; i += 1) {
    params[keys[i]] = items[i];
  }
  return params;
}

// init local storage
function initStorage() {
  const defaultCities = ['Moscow', 'Kaliningrad', 'Omsk', 'Saint-Petersburg', 'Ekaterinburg'];

  if (localStorage.getItem('cities') === null) {
    localStorage.cities = JSON.stringify(defaultCities);
  }
  if (localStorage.getItem('default-city') === null) localStorage['default-city'] = 'Moscow';
}

initStorage();
const queryPattern = 'https://weatherapi-com.p.rapidapi.com/forecast.json?q=';
const rapidapiKey = '5ea1a7bba0mshb4b5ef34560e186p1b62cbjsn45061317a9f6';
const rapidapiHost = 'weatherapi-com.p.rapidapi.com';
const defaultCity = localStorage['default-city'];

// Get API response
async function getWeatherJSON(cityOrCoords) {
  const query = queryPattern + cityOrCoords;
  const response = await fetch(query, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': rapidapiKey,
      'x-rapidapi-host': rapidapiHost,
    },
  });
  return [await response.json(), response.status];
}

// Fill weather report block
function convertDir(dir) {
  const dirs = {
    N: 'North', W: 'West', E: 'East', S: 'South',
  };
  let result = '';
  for (let i = 0; i < dir.length; i += 1) {
    result += dirs[dir[i]];
    if (i === 0 && dir.length > 1) result += '-';
  }
  return result;
}

async function fillReport(cityOrCoords, reportFields) {
  const [weather, status] = await getWeatherJSON(cityOrCoords);
  if (status === 200) {
    const { current } = weather;
    const { location } = weather;
    const report = reportFields;

    report.temp.textContent = `${Math.round(current.temp_c)}°C`;
    report.wind.textContent = `${current.wind_mph} m/s, ${convertDir(current.wind_dir)}`;
    report.cloud.textContent = `${current.cloud} %`;
    report.press.textContent = `${current.pressure_mb} hpa`;
    report.humidity.textContent = `${current.humidity} %`;
    report.coords.textContent = `[ ${location.lat}, ${location.lon} ]`;
    report.icon.src = current.condition.icon.replace(/64x64/i, '128x128');

    if (reportFields.city !== undefined) report.city.textContent = location.name;
  } else {
    throw new Error(`City ${cityOrCoords} hasn't been found`);
  }
}

// Loading process (hide block -> show laoder + fill report) -> hide loader + show block
function loadData(parentNode, loadingNodeSelector, loadFunction, delay) {
  const loadingNode = document.querySelector(loadingNodeSelector);
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

// Fill current by coords
function enableCurrent() {
  const parentNode = document.querySelectorAll('section')[0];
  loadData(parentNode, '.current-position', () => {
    const params = report2Params(document.querySelector('.weather-report'));
    params.temp = document.querySelector('p');
    params.icon = document.querySelector('.wi');
    params.city = document.querySelector('.place-current');

    navigator.geolocation.getCurrentPosition(async (position) => {
      const query = `${position.coords.latitude},${position.coords.longitude}`;
      await fillReport(query, params);
    }, async () => { await fillReport(defaultCity, params); });
  }, 500);
}

// Set default buttons onClick methods
function enableDeafultButtons() {
  const refreashCurrentBtn = document.querySelector('.square-btn');
  refreashCurrentBtn.onclick = () => { enableCurrent(); };

  const form = document.querySelector('form');
  form.onsubmit = () => {
    const newCity = document.querySelector('#search-field').value.trim();
    if (newCity !== '') {
      const pinnedCities = new Set(JSON.parse(localStorage.cities));
      pinnedCities.add(newCity);
      localStorage.cities = JSON.stringify([...pinnedCities]);
    }
  };
}

// Render card to htnl
async function createCard(CityName) {
  const template = document.querySelector('#pinned-card-template');

  const placeParams = report2Params(template.content.querySelector('.weather-report'));
  placeParams.temp = template.content.querySelector('p');
  placeParams.icon = template.content.querySelector('img');
  placeParams.template = template;
  placeParams.city = template.content.querySelector('h3');

  await fillReport(CityName, placeParams);

  const pinnedList = document.querySelector('.pinned-list');
  const clone = template.content.querySelector('li').cloneNode(true);

  pinnedList.appendChild(clone);
  clone.querySelector('button').onclick = () => {
    pinnedList.removeChild(clone);

    const pinnedCities = new Set(JSON.parse(localStorage.cities));
    pinnedCities.delete(CityName);
    localStorage.cities = JSON.stringify([...pinnedCities]);

    if ([...pinnedCities].length === 0) {
      document.querySelector('.pinned-empty').style.display = 'block';
    }
  };
}

// Loading favorites cities
function loadPinned() {
  const parent = document.querySelectorAll('section')[1];

  loadData(parent, '.pinned-list', async () => {
    const set = new Set(JSON.parse(localStorage.cities));
    const data = [...set];
    for (let i = 0; i < data.length; i += 1) {
      try {
        createCard(data[i]);
      } catch (err) {
        window.alert(err);
        set.delete(data[i]);
      }
    }
    localStorage.cities = JSON.stringify([...set]);

    if (JSON.parse(localStorage.cities).length === 0) {
      document.querySelector('.pinned-empty').style.display = 'block';
    }
  }, 1000);
}

enableCurrent();
loadPinned();
enableDeafultButtons();
