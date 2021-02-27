// [ latitude; longitude ]

function updateWeather(latitude, longitude){
    
}

function getCoords(position){
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    // return {"lat": lat, "long": long}
    return (lat, long)
}

function error(){
   window.alert("NE ROBIT")
}

var k = navigator.geolocation.getCurrentPosition(getCoords, error)
console.log(typeof k)