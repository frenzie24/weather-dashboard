const APIKey = "417a75b405f51c0868dbac2ee8413f5c";
let city = "atlanta";

const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

let weatherData = {};

function getCityWeatherData() {
    fetch(queryURL).then(response => response.json()).then(response => {
        weatherData = {
            feelsLike: response.main.feels_like,
            humidity: response.main.humidty,
            pressure: response.main.pressure,
            temp: response.main.temp,
            highTemp: response.main.temp_max,
            lowTemp: response.main.temp_min,
            description: response.weather.description,
            main: response.weather.main,
            wind: {
                speed: response.wind.speed,
                deg: response.wind.deg,
            },
            clouds: response.clouds.all,
            sunrise: new Date(response.sys.sunrise).toLocaleDateString(),
            sunset: new Date(response.sys.sunset).toLocaleDateString()
        };
        debugger;
    });
}

function setWeatherValues() {
    
}

function onSearchSubmit(ev) {
    ev.PreventDefault();
    city = $("#city-input").val();
    getCityWeatherData();
    $("#city-input").val("");
}
getCityWeatherData()