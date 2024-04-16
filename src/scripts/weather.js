const APIKey = "417a75b405f51c0868dbac2ee8413f5c";
let city = "atlanta";

let currentURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
//const currentURL = `https://api.openweathermap.org/data/3.0/onecall?q=${city}&appid=${APIKey}`;
let weatherData = {};


function getCityLatLon(name) {
    let lat, lon;
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${APIKey}`).then(r => r.json()).then(response => {
        lat = response[0].lat;
        lon = response[0].lon; 
        getCityWeatherData(lat, lon); 
    });
}
// converts a unixtimestamp to a formatted time string
function convertUNIXTimestamp(unixTimestamp) {
    let date = new Date(unixTimestamp * 1000);
    let hour = date.getHours();
    let ampm = "AM";
    if (hour > 12) {
        hour -= 12;
        ampm = "PM";
    }
    let min = date.getMinutes().toString();
    min = min.length <= 1 ? "0" + min : min;
    let sec = date.getSeconds().toString();
    sec = sec.length <= 1 ? "0" + sec : sec;
    return `${hour}:${min}:${sec} ${ampm}`
}

// takes passed weather data and returns a single formatted object
function parseWeatherData(data) {
    return {
        humidity: data.main.humidity + "%",
        pressure: convertHPatoInHG(data.main.pressure),
        description: data.weather[0].description,
        main: data.weather[0].main,
        wind: {
            speed: data.wind.speed,
            deg: degToCompass(data.wind.deg),
        },
        clouds: data.clouds.all,
        temp: convertToFahrenheit(data.main.temp),
        highTemp: convertToFahrenheit(data.main.temp_max),
        lowTemp: convertToFahrenheit(data.main.temp_min),
        feelsLike: convertToFahrenheit(data.main.feels_like),
        sunrise: convertUNIXTimestamp(data.sys.sunrise),
        sunset: convertUNIXTimestamp(data.sys.sunset),
    }
    
}

function getCityWeatherData(lat, lon) {
    fetch(currentURL).then(response => response.json()).then(response => {
        weatherData = parseWeatherData(response);
        // convert the unix time string from openweather into something usable

        setWeatherValues()

    });
    let forecastData = [];
    let forecastURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    fetch(forecastURL).then(response => response.json()).then(response => {
        response.list.forEach(entry => {
            forecastData.push(parseWeatherData(entry));
        })
        debugger;
    })
}

function convertToFahrenheit(temp) {
    //converts supplied temp in kelvin to fahrenheit with a limit of a single decimal place
    return ((temp - 273.15) * (9 / 5) + 32).toFixed(1);
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

// converts passed pressue in hPa to inHG
function convertHPatoInHG(pressure) {
    return (pressure * 0.02952998057228486).toFixed(2) + " inHg";
}

function setWeatherValues() {
    $("#feels-like h1").text(weatherData.feelsLike);
    $("#pressure h1").text(weatherData.pressure);
    $("#humidity h1").text(weatherData.humidity);
    $("#wind h1").text(weatherData.wind.speed);
    $("#wind h2").text(weatherData.wind.deg);
    $("#sunrise h2").text(weatherData.sunrise);
    $("#sunset h2").text(weatherData.sunset);
    $("#sunset h2").text(weatherData.sunset);
    $("#temp").text(weatherData.temp);
    $("#high-temp").text(weatherData.highTemp);
    $("#low-temp").text(weatherData.highTemp);
    $("#rain-chance").text(weatherData.highTemp);
    $("#clouds").text(weatherData.highTemp);


}

function onSearchSubmit(ev) {
    ev.PreventDefault();
    
    getCityLatLon("Atlanta");
    city = $("#city-input").val();
    $("#city-input").val("");
}

getCityLatLon("Atlanta");