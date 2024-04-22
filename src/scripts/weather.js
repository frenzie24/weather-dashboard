const APIKey = "417a75b405f51c0868dbac2ee8413f5c";


//const currentURL = `httpss://api.openweathermap.org/data/3.0/onecall?q=${city}&appid=${APIKey}`;
let weatherData = {};
const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function getCityLatLon(name) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    let lat, lon;
    console.log("getCityLatLon called")
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${APIKey}`).then(r => r.json()).then(response => {
        try {
            lat = response[0].lat;
            lon = response[0].lon;
            getCityWeatherData(lat, lon);
        }
        catch (e) {
            alert("Error in your city search,\ntry again please.")
            console.log(e)
        }
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

function convertUNIXTimestampToDay(unixTimestamp) {
    //let date = new Date(unixTimestamp * 1000);
    let day = dayjs(unixTimestamp * 1000);
    day = day.day();
    return weekDays[day];

}

function getWeekday(dateString) {
    let day = dayjs(dateString);
    return weekDays[day.day()];
}

// takes passed weather data and returns a single formatted object
function parseWeatherData(data) {
    if (!data) return;
    try {
        if (data.main == undefined) { debugger; }
    } catch {
        debugger;
    }
    return {
        humidity: data.main ? data.main.humidity + "%" : "",
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
        day: getWeekday(data.dt_txt)
    }

}

function getCityWeatherData(lat, lon) {

    let currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    fetch(currentURL).then(response => response.json()).then(response => {
        weatherData = parseWeatherData(response);
        // convert the unix time string from openweather into something usable

        setWeatherValues()

    });
    let forecastData = [];
    let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    fetch(forecastURL).then(response => response.json()).then(response => {
        /* response.list.forEach(entry => {
             forecastData.push(parseWeatherData(entry));
         })*/
        j = 1;
        for (let i = 0; i < 5; i++) {
            setForecastCard(`day${i}`, parseWeatherData(response.list[j]))
            debugger;
            j += 8;
            if(j>40) {j=39;}

        }
        debugger;
    })
}

function convertToFahrenheit(temp) {
    //converts supplied temp in kelvin to fahrenheit with a limit of a single decimal place
    return ((temp - 273.15) * (9 / 5) + 32).toFixed(1);
}

// this function was sourced from 
// httpss://stackoverflow.com/a/25867068
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


// use jquery to set element values
function setWeatherValues() {
    $("#feels-like h1").text(weatherData.feelsLike  + '° F') ;
    $("#pressure h1").text(weatherData.pressure);
    $("#humidity h1").text(weatherData.humidity+"% Humidity");
    $("#wind h1").text("Wind Speed:\n"+weatherData.wind.speed+" m/s");
    $("#wind h2").text("Wind Direction:\n"+weatherData.wind.deg);
    $("#sunrise h1").text(weatherData.sunrise);
    $("#sunset h1").text(weatherData.sunset);
    $("#current-day").text(weekDays[dayjs().day()]);
    $("#temp").text(weatherData.temp + '° F');
    $("#high-temp").text(`High:\n${weatherData.highTemp}° F`);
    $("#low-temp").text("Low:\n"+weatherData.lowTemp + '° F');
    $("#rain-chance").text(weatherData.description);
    $("#clouds").text(`Cloudiness: ${weatherData.clouds}%`);
   
}

function setForecastCard(card, data) {
    let t = $(`#${card} h3`)
    $(`#${card} h1`).text(data.day);
    $(`#${card} h2`).text(`${data.temp}° F`);
    t[0].innerHTML = "Wind Speed:\n"+data.wind.speed+" m/s";
    t[1].innerHTML = (data.wind.deg);
    t[2].innerHTML = (data.clouds)+"%";
    $(`#${card} h4`).text(data.description);

}

function populateSearchHistory() {
    let cities = getItem("cities");
    let searches = $("#search-history");
    searches.empty();
    let list = [];
    cities.forEach(city => {

        list.push($("<li>").on('click', (ev) => {
            let name = ev.target.textContent;
            $("#city-input").val(name);
            getCityLatLon(name);
        }).text(city));
    });
    searches.append(list);
}


function clock() {



    setInterval(() => {
        let time = new Date();
        $("#time").text(time.toLocaleTimeString())
        $("#date").text(time.toLocaleDateString())
    })
}

function onSearchSubmit(ev) {
    ev.preventDefault();

    let city = $("#city-input").val();

    getCityLatLon(city);
    let cities = getItem("cities");
    if (!cities) cities = [];
    let newCity = true;
    cities.forEach(town => {
        // if the city is already in the search history dont push 
        if (city === town) newCity = false;
    })
    if (newCity) {
        cities = [city, ...cities];
        setItem('cities', cities);
    }

    populateSearchHistory();
}

$(document).ready(() => {
    //   $('#city-input').on("submit", onSearchSubmit);
    $('#city-input').on("keydown", function (e) {
        if (e.keyCode == 13) {
            onSearchSubmit(e);
        }
    });
    //clock();
    let cities = getItem("cities");
    if (cities) {
        getCityLatLon(cities[0]);

        $("#city-input").val(cities[0]);

    } else {
        getCityLatLon("Atlanta");

        $("#city-input").val("Atlanta");
    }
    populateSearchHistory();
   // $("h1").css("font-size", "200%");
    $("#forecast-container").css('font-size', '8')
   
    
});