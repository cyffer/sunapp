var API = "d32e01c2a229b088b50b091efc749c20";
var temp;
var loc;
var icon;
var humidity;
var wind;
var direction;
var colorId;

function updateByZip(zip){
	var url = "http://api.openweathermap.org/data/2.5/weather?" + 
	"zip=" + zip +
	"&APPID=" + API;
	sendRequest(url);
}

function updateByGeo(lat, lon){
	var url = "http://api.openweathermap.org/data/2.5/weather?" +
	"lat=" + lat +
	"&lon=" + lon +
	"&APPID=" + API;
	sendRequest(url);
}

function sendRequest(url){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200 ){
			var data = JSON.parse(xmlhttp.responseText);
			var weather = {};
			weather.icon = data.weather[0].id;
			weather.humidity = data.main.humidity;
			weather.wind = data.wind.speed;
			weather.direction = degtodir(data.wind.deg);
			weather.loc = data.name;
			weather.temp = keltof(data.main.temp);
			update(weather);
			colorId = weather.icon;
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
	}

function degtodir(degrees){
	var range = 360/16;
	var low = 360- range/2;
	var high = (low + range) % 360;
	var dirzones = [ "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
	for(i in dirzones){

		if( degrees >= low && degrees < high)
			return dirzones[i];

		low = (low + range) % 360;
		high = (high + range) % 360;
	}
	return "N";
}

function keltoc(kelvin){
	return Math.round(kelvin - 273.15);
}

function keltof(kelvin){
	return Math.round(kelvin*(9/5)-459.67);
}

var weather =[ 
	{
	bg:"#788A9A",
	codes:[200, 201, 202, 210, 211, 212, 221, 230, 231, 232]
	},
	{
	bg:"#444342",
	codes: [300, 301, 302, 310, 311, 312, 313, 314, 321]
	},
	{
	bg: "#53514F",
	codes: [500, 501, 502, 504, 511, 520, 521, 522, 531]
	},
	{
	bg: "#A1AAAD",
	codes:[600, 601, 602, 611, 612, 615, 616, 620, 621, 622]
	},
	{
	bg: "#414F85",
	codes: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781]
	},
	{
	bg: "#3090BE",
	codes: [800, 801, 802, 803, 804]
	}
]


function bgColor(id){ 	
	hex = [];
	for(var i = 0; i < weather.length; i++){
		for(var j in weather[i]){
			if(weather[i][j].indexOf(id)!= -1){
				hex.push(weather[i].bg);
			}
		}
	}
	return hex[0];
	
}


function update(weather){
	wind.innerHTML = weather.wind;
	direction.innerHTML = weather.direction;
	humidity.innerHTML = weather.humidity;
	loc.innerHTML = weather.loc;
	temp.innerHTML = weather.temp;
	//id.innerHTML= weather.id;
	icon.src = "imgs/codes/" + weather.icon + ".png";
	//console.log(icon);
}



window.onload = function(){
	temp = document.getElementById("temperature");
	loc = document.getElementById("location");
	icon = document.getElementById("icon");
	humidity = document.getElementById("humidity");
	wind = document.getElementById("wind");
	direction = document.getElementById("direction");
	id = document.getElementById("mainpannel");

function bgChange(val){
  	var hex = val;
 	return	document.body.style.backgroundColor= hex;
	}

	

	if(navigator.geolocation){
	var showPosition = function(position){
	    updateByGeo(position.coords.latitude, position.coords.longitude);
	}    	
	navigator.geolocation.getCurrentPosition(showPosition);
	} else {
	var zip = window.prompt("Could not get your location please enter zip code")
	updateByZip(zip);
	}	

bgColor(colorId);
bgChange(hex);

}






//window.onload = body.style.backgroundColor = "hex";

// function bgChange(hex){
// 	document.body.style.backgroundcolor= hex;
// }




	// var weather = {};
	// weather.wind = 3.5;
	// weather.direction = "N";
	// weather.humidity = 35;
	// weather.loc = "Hoboken";
	// weather.temp = "45";
	// weather.icon = 200;
	// update(weather);
	


