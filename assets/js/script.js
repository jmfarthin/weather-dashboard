// global variables to be used in any function
var searchForm = document.querySelector('#search-form');
var apiKey = "27d8cd69bb1174f9c5753f20a7b825cb"
var newCityData = {};
var buttonArr = [];
var buttonList = document.querySelector("#button-column");
var forecastTitle = document.querySelector("#forecast-title");


// Uses user input to fetch lat and lon from open weather API and use it for function to get weather data.
async function getLatLon(event) {
    event.preventDefault();

    var searchInput = document.querySelector("#city-search").value.trim();
    document.querySelector("#city-search").value = '';

    if (!searchInput) {
        console.error("you didn't enter a value");
        return;
    }
    console.log(searchInput);

    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput},US&limit=1&appid=${apiKey}`;
    let repoData = await fetch(requestUrl);
    let data = await repoData.json();


    var latData = data[0].lat;
    var lonData = data[0].lon;
    console.log(latData, lonData);

    getWeatherData(latData, lonData, searchInput);
};

// event listener for search submit
searchForm.addEventListener('submit', getLatLon);

// fetches weather data from Open Weather API using latitude and longitude and calls function to save forecast data
async function getWeatherData(lat, lon, city) {
    var requestUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=27d8cd69bb1174f9c5753f20a7b825cb`
    let apiData = await fetch(requestUrl);
    let weatherData = await apiData.json();

    var cityName = city
    console.log(weatherData);
    console.log(cityName);

    setCityData(weatherData, cityName);
};

// Saves necessary city forecast data to an array, saves it to local storage using a unique key, 
// creates a new button for the city, and calls function to load forecast to webpage.
function setCityData(data, city) {
    var newCity = city;
    var currentStorage = JSON.parse(localStorage.getItem(newCity));
    if (currentStorage === null) {
        cityForecastData = {
            name: newCity,
            weather: []
        }
        for (i = 0; i < 6; i++) {
            var dailyData = {
                date: dayjs.unix(data.daily[i].dt).format("M-D-YYYY"),
                temp: data.daily[i].temp.day,
                wind: data.daily[i].wind_speed,
                humidity: data.daily[i].humidity,
                icon: data.daily[i].weather[0].icon,
            };
            cityForecastData.weather.push(dailyData);
        };
        localStorage.setItem(city, JSON.stringify([cityForecastData]));
        console.log(cityForecastData);

        //create new button for city
        var newButton = document.createElement("button")
        buttonList.appendChild(newButton);
        newButton.classList.add('button', 'is-fullwidth', 'is-primary', 'is-light')
        newButton.innerHTML = city
        newButton.addEventListener('click', function () {
            console.log(city);
            loadCityForecast(city);
        });

        // store data for buttons
        var cityStorage = JSON.parse(localStorage.getItem('city'));
        if (cityStorage === null) {
            buttonArr.push(newCity);
            localStorage.setItem('city', JSON.stringify(buttonArr));
        } else {
            cityStorage.push(newCity);
            localStorage.setItem('city', JSON.stringify(cityStorage));
        }
        //loads forecast to page
        loadCityForecast(newCity);
    } else {
        loadCityForecast(newCity);
    };
};

// function renders the forecast to premade cards that are revealed after data is inserted into the HTML
function loadCityForecast(city) {
    var newCity = city;
    var currentStorage = JSON.parse(localStorage.getItem(newCity));

    forecastTitle.innerHTML = "5-Day Forecast:"

    for (i = 0; i < 6; i++) {
        var card = document.querySelector(`#card-${i}`);
        card.querySelector('.card-header-title').textContent = `${currentStorage[0].name} (${currentStorage[0].weather[i].date})`;
        card.querySelector('img').src = `./assets/images/icons/${currentStorage[0].weather[i].icon}.png`;

        var temp = card.querySelector('ul :nth-child(1)')
        temp.innerHTML = `Temp: ${currentStorage[0].weather[i].temp}&#8457`;

        var wind = card.querySelector('ul :nth-child(2)')
        wind.innerHTML = `Wind: ${currentStorage[0].weather[i].wind}MPH`;

        var humidity = card.querySelector('ul :nth-child(3)')
        humidity.innerHTML = `Humidity: ${currentStorage[0].weather[i].humidity}%`;
        card.hidden = false;
    };
};


//function renders the city buttons to the webpage
function loadCityList() {
    var loadList = localStorage.getItem('city');
    if (loadList === null) {
        return;
    };
    var cityList = JSON.parse(loadList);
    console.log(cityList);
    // creates each button
    for (i = 0; i < cityList.length; i++) {
        var newButton = document.createElement("button")
        buttonList.appendChild(newButton);
        newButton.classList.add('button', 'is-fullwidth', 'is-primary', 'my-2')
        newButton.innerHTML = cityList[i]
        var listCity = cityList[i];
        console.log(listCity);
    }
};

//adds event listener to the container of the buttons
buttonList.addEventListener("click", function (event) {
    var expCity = event.target.textContent;
    console.log(expCity);
    loadCityForecast(expCity);
});

loadCityList();







