//http://codepen.io/abdelaziz18003/pen/yYaWXK
//adding the method "round2" to Math object
Math.round2 = function(number){
	return Math.round(number * 100) / 100;
};

//"geoLocation" is an object containing position variables and methods
var geoLocation = {
	latitude: 0,
	longitude: 0,

	//setting geoLacation latitude and longitude and API url 
	getLocation: function(callback){
		var thisGeoLocation = this;
		if(!navigator.geolocation){
			alert('Geolocation is not supported by this browser');
		}else {
			$('.weather-description p').text('Finding position ...');
			navigator.geolocation.getCurrentPosition(function(position){
        weather.apiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=';
				thisGeoLocation.latitude = Math.round2(position.coords.latitude);
				thisGeoLocation.longitude = Math.round2(position.coords.longitude);
				weather.apiUrl += thisGeoLocation.latitude + '&lon=' + thisGeoLocation.longitude + '&units=metric&APPID=' + weather.apiKey;
				//window.open(weather.apiUrl);
				callback(weather.apiUrl, weather.updateWeatherInfo.bind(weather));
			});
		}
	}
};

var weather = {
	region: '',
	sky: '',
	description: '',
	clouds: 100,
	tempValue: 0,
	windSpeed: '',
	tempUnit:'C',
	distanceUnit: 'km',
	apiUrl: 'http://api.openweathermap.org/data/2.5/weather?lat=',
	imgUrl: 'http://res.cloudinary.com/abdelaziz18003/image/upload/v1443203510/showLocalWeather/',
  apiKey: '50ecbf4bd6f6b216a792f708f314c9f9',

	//getting weather informations via an ajax request
	getWeather: function(url, callback){
		var thisWeather = this;
		$.ajax(url, {
			success: function(data){
				thisWeather.region = data.name;
				thisWeather.sky = data.weather[0].main;
				thisWeather.description = data.weather[0].description;
				thisWeather.clouds = data.clouds.all;
				thisWeather.tempValue = Math.round2(data.main.temp);
				thisWeather.windSpeed = Math.round2(data.wind.speed * 3.6);
				callback();
			},
			error: function(request, errorType, errorMessage){
				alert("error:" + errorType + '\nmessage:' + errorMessage);
				console.log("error:" + errorType + '\nmessage:' + errorMessage);
				$('.weather-description p').text('Error occured !!!');

			},
			beforeSend: function(){
				$('.weather-description p').text('Loading weather infos ...');
			}
		});
	},


	updateWeatherInfo: function(){
		
		//updating region name
		$(".region-name").text(this.region);
		
		//updating the weather icon
		switch(this.sky){
			case 'Clear':
			case 'Rain':
			case 'Snow':
			case 'Thunderstorm':
				$('.weather-icon img').attr('src', this.imgUrl + this.sky.toLowerCase() + '.png');
				break;
			case 'Clouds':
				if(this.clouds > 50){
					$('.weather-icon img').attr('src', this.imgUrl + 'clouds.png');
				}else {
					$('.weather-icon img').attr('src', this.imgUrl + 'clear-clouds.png');
				}
				break;
			default:
				$('.weather-icon img').attr('src', this.imgUrl + 'clear.png');
		}

		//updating the weather background
		$('section').css({'background-image': 'url(' + weather.imgUrl + weather.sky + '-bg.jpg)'});
		
		//updating the weather description
		$('.weather-description p').text(this.description);
		
		//updating the temperature value
		if(this.tempUnit === 'C'){
			$('.temperature-value p').text(this.tempValue + ' °'+ this.tempUnit); //show the value in °C
		}else {
			$('.temperature-value p').text(Math.round2(this.tempValue * 1.8 + 32) + ' °F'); //show the value in °F
		}

		//updating the wind speed value
		if(this.distanceUnit === 'km'){
		$('.wind-speed p ').text(this.windSpeed + ' km/h');
		}else {
			$('.wind-speed p').text(Math.round2(this.windSpeed * 0.6214) + ' mi/h');
		}
	}
};

//main script
$(document).ready(function() {
	$('.weather-icon').on('click', 'img', function(){
		geoLocation.getLocation(weather.getWeather.bind(weather));
	});
	$('.temperature-icon').on('click', 'img', function(){
		weather.tempUnit = weather.tempUnit === 'C' ? 'F' : 'C';
		weather.updateWeatherInfo();

	});
	$('.wind-icon').on('click', 'img', function(){
		weather.distanceUnit = weather.distanceUnit === 'km' ? 'mi' : 'km';
		weather.updateWeatherInfo();
	});
});