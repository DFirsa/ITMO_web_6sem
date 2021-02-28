// [ latitude; longitude ]

// function updateWeather(latitude, longitude){
    
// }

// function getCoords(position){
//     const lat = position.coords.latitude;
//     const long = position.coords.longitude;
//     return {"lat": lat, "long": long}
//     // return tuple (lat, long)
// }

// function error(){
//    window.alert("NE ROBIT")
// }

// var k = navigator.geolocation.getCurrentPosition(getCoords, error)
// console.log(k)

fetch("https://weatherapi-com.p.rapidapi.com/forecast.json?q=Saint-Petersburg", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "5ea1a7bba0mshb4b5ef34560e186p1b62cbjsn45061317a9f6",
		"x-rapidapi-host": "weatherapi-com.p.rapidapi.com"
	}
})
.then(response => {
	console.log(response.text());
})
.catch(err => {
	console.error(err);
});