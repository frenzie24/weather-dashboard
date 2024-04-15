const APIKey = "417a75b405f51c0868dbac2ee8413f5c";
let city = "atlanta";

const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;



function getCityWeatherData() {
    fetch(queryURL).then(response => response.json()).then(response => {
        debugger;
    });
}

function onSearchSubmit(ev) {
    ev.PreventDefault();
    city = $("#city-input").val();
    getCityWeatherData();
    $("#city-input").val("");
}