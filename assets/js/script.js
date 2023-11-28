let APIkey = '45f42fe1e7919a2ec27993b0a0b90a7e';

let cityList = document.querySelector("#cityList");
let chosenCity = document.getElementById('search-input'); 
let submitBtn = document.getElementById('submitBtn'); 
let clearBtn = document.getElementById('clearBtn');
let cities = document.getElementById('cities');
let forecast = document.getElementById('forecast');
let today = document.getElementById('today')

let limit = 5;

let savedCities = [];
let cityOptionsList = [];

let cityInfo = {
    lon: 0,
    lat: 0,
    cityName: ""
}

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

submitBtn.addEventListener('click', userSearch);
clearBtn.addEventListener('click', clearList);

//have the saved previously searched cities populate upon page load
function init () {
    getStoredCities();
    showCityList();
}

function getStoredCities() {
    savedCities = JSON.parse(localStorage.getItem("storageSavedCities")) || [];
}

//alert user if they do not input any data into the field
function userSearch(){
    let city = chosenCity.value.trim();
    console.log('chosenCity -> ', city);
    if (city == "") {
        window.alert("Please enter a valid city name.");
    }
    else {
        citySearch(city);
    }
}


function chooseCity() {
    cities.setAttribute('style', 'display: none');

    let isDoubled = false;
    let selectedCityIndex = cities.selectedIndex-1;
    let lon = cityOptionsList[selectedCityIndex].lon;
    let lat = cityOptionsList[selectedCityIndex].lat;
    let cityName = cityOptionsList[selectedCityIndex].name;

    getStoredCities();

    //add condition to check if two of the same cities are being saved into local storage
    for (let i = 0; i < savedCities.length; i++) {
        let city = savedCities[i];
        if (city.cityName == cityName) {
            isDoubled = true;
            break;
        }
    }

    if (!isDoubled) {
        cityInfo.lon = lon;
        cityInfo.lat = lat;
        cityInfo.cityName = cityName;
        
        savedCities.push(cityInfo);
        localStorage.setItem("storageSavedCities", JSON.stringify(savedCities));
    }

    showCityList();
    getTodaysWeather(lon, lat, cityName);
    getFiveDayCast(lon, lat);
}


//API call to get city name
function citySearch(cityName){
    let coordinatesAPI = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=' + limit + '&appid=' + '45f42fe1e7919a2ec27993b0a0b90a7e';
    
    fetch(coordinatesAPI, {
    method: 'GET'
    })
    .then(function (response) {
        return response.json();
    }).then( function(data) {
        cities.innerHTML = "";
        cityOptionsList = data;
        let optionPlaceholder = document.createElement("option");
        optionPlaceholder.setAttribute("selected", "selected")
        optionPlaceholder.textContent = "Select City";
        cities.appendChild(optionPlaceholder);
        
        for (let i = 0; i < cityOptionsList.length; i++) {
            let option = document.createElement("option");
            option.textContent = cityOptionsList[i].name + ', ' + cityOptionsList[i].state + ', ' + cityOptionsList[i].country; 
            cities.appendChild(option);
        }
        cities.setAttribute('style', 'display: block');
    });
}

//populate todays weather information 
function getTodaysWeather(lon, lat, cityName) {
    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lat=' + lat + '&lon=' + lon + '&appid=' + '45f42fe1e7919a2ec27993b0a0b90a7e';
    fetch(queryURL, {
        method: 'GET'
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let todayWeatherCity = document.getElementById('today-weather-city')
        let getDay = String(new Date());
        let dateOnly = getDay.split(" ");
    
        todayWeatherCity.textContent = cityName + " (" + dateOnly[0] + ", " + dateOnly[1] + " " + dateOnly[2] + ")";

        let temperature = document.getElementById('temp');
        temperature.textContent='Temp: ' + data.main.temp;
        let wind = document.getElementById('wind');
        wind.textContent='Wind Speed: ' + data.wind.speed;
        let humidity = document.getElementById('humidity');
        humidity.textContent='Humidity: ' + data.main.humidity + "%";
    } )
}

//API call to get forecast for a selected city based on its latitude and longitude
function getFiveDayCast(lon, lat) {
    let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=' + lat + '&lon=' + lon + '&appid=' + '45f42fe1e7919a2ec27993b0a0b90a7e';
    
    forecast.setAttribute('style', 'display: block');

    fetch(queryURL, {
        method: 'GET'
        })
        .then(function (response) {
            return response.json();
        }).then( function(data) {
            let daysList = data.list;
            
            for (let i=0; i < daysList.length; i+=8) {
                let j=i/8; 
                let dateOnly = daysList[i].dt_txt;
                dateOnly = dateOnly.split(" ");
                dateOnly = dateOnly[0];
                let getDay = new Date(dateOnly);
                let day = getDay.getDay();
                let date = document.getElementById('date' + j);
                date.textContent = dateOnly;
                let dayOfWeek = document.getElementById('day' + j);
                dayOfWeek.textContent = dayNames[day];
                let temperature = document.getElementById('temp' + j);
                temperature.textContent='Temp: ' + daysList[i].main.temp;
                let wind = document.getElementById('wind' + j);
                wind.textContent='Wind Speed: ' + daysList[i].wind.speed;
                let humidity = document.getElementById('humidity' + j);
                humidity.textContent='Humidity: ' + daysList[i].main.humidity + "%";
            }
            
            
        });
}    

//adds previously searched cities into a list on the page, make each list item a button to be clicked
function showCityList() {
    cityList.innerHTML = "";

    for (let i = 0; i < savedCities.length; i++) { 
        selectedCity = savedCities[i];

        let li = document.createElement("li");
        let button = document.createElement("button");
        button.textContent = selectedCity.cityName;
        button.setAttribute('data-index', i);
        button.setAttribute('id', "savedListButton" + i);
        li.appendChild(button);
        cityList.appendChild(li);

        listButton = document.getElementById("savedListButton"+i);
        listButton.addEventListener('click', showSavedCityWeather);
    }    
}

function showSavedCityWeather(event) {
    let currentChoiceIndex = event.currentTarget.getAttribute("data-index");

    let lon = savedCities[currentChoiceIndex].lon;
    let lat = savedCities[currentChoiceIndex].lat;
    let cityName = savedCities[currentChoiceIndex].cityName;

    getTodaysWeather(lon, lat, cityName);
    getFiveDayCast(lon, lat);
}

function clearList() {
    savedCities = [];
    localStorage.setItem("storageSavedCities", JSON.stringify(savedCities));
    showCityList();
}

init();