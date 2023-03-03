
var searchForm = document.querySelector('#search-form');
// var searchInput = document.querySelector("#city-search").value.trim();

async function getLatLon(event) {
    event.preventDefault();

    var searchInput = document.querySelector("#city-search").value.trim();

    if (!searchInput) {
        console.error("you didn't enter a value");
        return;
    }
    console.log(searchInput);

    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput},US&limit=1&appid=27d8cd69bb1174f9c5753f20a7b825cb`;
    let repoData = await fetch(requestUrl);
    let data = await repoData.json();
    // console.log(data);

    var latData = data[0].lat;
    var lonData = data[0].lon;
    console.log(latData, lonData);

    // createCityButton(searchInput);
    getWeatherData(latData, lonData);
};

searchForm.addEventListener('submit', getLatLon);

async function getWeatherData(lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=27d8cd69bb1174f9c5753f20a7b825cb`
    let apiData = await fetch(requestUrl);
    let weatherData = await apiData.json();
    console.log(weatherData);
    // console.log(weatherData.current.weather[0].icon);
    var unixDate = weatherData.daily[1].dt;
    console.log(unixDate);

    var date = dayjs.unix(unixDate).format("M-D-YYYY");
    console.log(date);
};
