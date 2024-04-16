const APIKey = "417a75b405f51c0868dbac2ee8413f5c";
let city = "atlanta";

const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

let weatherData = {};

function convertUNIXTimestamp(unixTimestamp) {
    let date = new Date(unixTimestamp *1000);
    let hour = date.getHours();
    let ampm = "AM";
    if (hour > 12) {
        hour -= 12;
        ampm = "PM";
    }
    let min = date.getMinutes().toString();
    min = min.length <= 1 ? "0"+min : min; 
    let sec = date.getSeconds().toString();
    sec = sec.length <= 1 ? "0"+sec : sec;
    return `${hour}:${min}:${sec} ${ampm}`
}

function getCityWeatherData() {
    fetch(queryURL).then(response => response.json()).then(response => {
        weatherData = {
            feelsLike: response.main.feels_like,
            humidity: response.main.humidity,
            pressure: response.main.pressure,
            description: response.weather[0].description,
            main: response.weather[0].main,
            wind: {
                speed: response.wind.speed,
                deg: response.wind.deg,
            },
            clouds: response.clouds.all,
        };
        // convert the unix time string from openweather into something usable
        weatherData.temp = convertToFahrenheit(response.main.temp);
        weatherData.highTemp = convertToFahrenheit(response.main.temp_max);
        weatherData.lowTemp = convertToFahrenheit(response.main.temp_min);
        weatherData.sunrise = convertUNIXTimestamp(response.sys.sunrise);
        weatherData.sunset = convertUNIXTimestamp(response.sys.sunset);
        debugger;
        setWeatherValues()
        
    });
}

function convertToFahrenheit(temp) {
    return (temp - 273.15 ) * (9/5) + 32;
}

function setWeatherValues() {
    let feelsLike = $("#feels-like h1");
    $("#feels-like h1").text(weatherData.feelsLike);
}

function onSearchSubmit(ev) {
    ev.PreventDefault();
    city = $("#city-input").val();
    getCityWeatherData();
    $("#city-input").val("");
}
getCityWeatherData()