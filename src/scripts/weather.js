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
            humidity: response.main.humidity,
            pressure: response.main.pressure,
            description: response.weather[0].description,
            main: response.weather[0].main,
            wind: {
                speed: response.wind.speed,
                deg: degToCompass(response.wind.deg),
            },
            clouds: response.clouds.all,
        };
        // convert the unix time string from openweather into something usable
        weatherData.temp = convertToFahrenheit(response.main.temp);
        weatherData.highTemp = convertToFahrenheit(response.main.temp_max);
        weatherData.lowTemp = convertToFahrenheit(response.main.temp_min);
        weatherData.feelsLike = convertToFahrenheit(response.main.feels_like);
        weatherData.sunrise = convertUNIXTimestamp(response.sys.sunrise);
        weatherData.sunset = convertUNIXTimestamp(response.sys.sunset);

        debugger;
        setWeatherValues()
        
    });
}

function convertToFahrenheit(temp) {
    //converts supplied temp in kelvin to fahrenheit with a limit of a single decimal place
    return ((temp - 273.15 ) * (9/5) + 32).toFixed(1);
}

// this function was sourced from 
// https://stackoverflow.com/a/25867068
// I modified it for readability.  
// Takes a passed degree and parses it into a direction string
function degToCompass(deg) {
    var index = Math.floor((deg / 22.5) + 0.5);
    var directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return directions[(index % 16)];
}

function convertHPatoMMHG(pressure) {
    return (pressure * 0.75006375541921);
}

function setWeatherValues() {
    $("#feels-like h1").text(weatherData.feelsLike);
    $("#pressure h1").text(weatherData.pressure);
    $("#humidity h1").text(weatherData.humidity);
    $("#wind h1").text(weatherData.wind.speed);
    $("#wind h2").text(weatherData.wind.deg);
    $("#sunrise h2").text(weatherData.sunrise);
    $("#sunset h2").text(weatherData.sunset);
}

function onSearchSubmit(ev) {
    ev.PreventDefault();
    city = $("#city-input").val();
    getCityWeatherData();
    $("#city-input").val("");
}
getCityWeatherData()