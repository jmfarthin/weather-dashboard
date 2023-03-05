
var searchForm = document.querySelector('#search-form');
var apiKey = "27d8cd69bb1174f9c5753f20a7b825cb"
var newCityData = {};

async function getLatLon(event) {
    event.preventDefault();

    var searchInput = document.querySelector("#city-search").value.trim();
    document.querySelector("#city-search").value = '';

    if (!searchInput) {
        console.error("you didn't enter a value");
        return;
    }
    console.log(searchInput);

    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput},US&limit=1&appid=${apiKey}`;
    let repoData = await fetch(requestUrl);
    let data = await repoData.json();
    // console.log(data);

    var latData = data[0].lat;
    var lonData = data[0].lon;
    console.log(latData, lonData);

    getWeatherData(latData, lonData, searchInput);

    
};

searchForm.addEventListener('submit', getLatLon);

async function getWeatherData(lat, lon, city) {
    var requestUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=27d8cd69bb1174f9c5753f20a7b825cb`
    let apiData = await fetch(requestUrl);
    let weatherData = await apiData.json();
    
    // var cityNameRequestUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    // let apiCityData = await fetch(cityNameRequestUrl);
    // let cityNameData = await apiCityData.json();

    var cityName = city
    console.log(weatherData);
    console.log(cityName);

    // console.log(weatherData.current.weather[0].icon);
    // var unixDate = weatherData.daily[1].dt;
    // var date = dayjs.unix(unixDate).format("M-D-YYYY");

    setCityData(weatherData, cityName);
};

function setCityData(data, city){
    var newCity = city;
    var currentStorage = JSON.parse(localStorage.getItem(newCity));
    if (currentStorage === null) {
        cityForecastData = {
            name: newCity,
            weather: []
        }
        for (i=0; i < 6; i++) {
            var dailyData = {
                date: dayjs.unix(data.daily[i].dt).format("M-D-YYYY"),
                temp: data.daily[i].temp.day,

            };
            cityForecastData.weather.push(dailyData);
        };
        localStorage.setItem(city, JSON.stringify([cityForecastData]));
        console.log(cityForecastData);

          // createCityButton(searchInput);
    } else {
        // loadCityForecast(cityForecastData);
        window.alert("this city already exists.");
    };

};

// function saveToStorage(newData) {

// }
