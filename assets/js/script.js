
var searchForm = document.querySelector('#search-form');


function getLatLon(event) {
    event.preventDefault();

    var searchInput = document.querySelector("#city-search").value;

    if (!searchInput) {
        console.error("you didn't enter a value");
        return;
    }
    console.log(searchInput);
};

searchForm.addEventListener('submit', getLatLon);