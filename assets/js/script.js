let APIkey = '45f42fe1e7919a2ec27993b0a0b90a7e';

let cityList = document.querySelector("#cityList");
let chosenCity = document.getElementById('search-input'); 
let submitBtn = document.getElementById('submitBtn'); 
let clearBtn = document.getElementById('clearBtn');
let cities = document.getElementById('cities');


let limit = 5;
let savedCities = [];
let cityOptionsList = [];

submitBtn.addEventListener('click', userSearch);
clearBtn.addEventListener('click', clearList);

function init () {
    savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
}

function userSearch(){
    let city = chosenCity.value.trim();
    console.log('chosenCity -> ', city);
    if (city == "") {
        window.alert("Please enter a valid city name.");
    }
    else {
        citySearch(city);
    }

    // submitSearch();
}

function chooseCity() {
    cities.setAttribute('style', 'display: none');
    // let value = cities.value;
    let selectedCityIndex = cities.selectedIndex-1;
    let lon = cityOptionsList[selectedCityIndex].lon;
    let lat = cityOptionsList[selectedCityIndex].lat;
    callQuery(lon, lat);
    console.log('here');
}

function citySearch(cityName){
    let coordinatesAPI = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=' + limit + '&appid=' + '45f42fe1e7919a2ec27993b0a0b90a7e';
    
    fetch (coordinatesAPI, {
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
            // cities.options[i+1].text = cityOptionsList[i].name + ', ' + cityOptionsList[i].state + ', ' + cityOptionsList[i].country; 
        }
        cities.setAttribute('style', 'display: block');
        console.log(cityOptionsList[0]);
    });
}

function callQuery(lon, lat) {
    let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=' + lat + '&lon=' + lon + '&appid=' + '45f42fe1e7919a2ec27993b0a0b90a7e';
    console.log(queryURL);
    fetch (queryURL, {
        method: 'GET'
        })
        .then(function (response) {
            return response.json();
        }).then( function(data) {
            let daysList = data.list;
            console.log(data);
            for (let i=0; i < daysList.length; i+=8) {
                console.log("TEMP FOR: " + daysList[i].dt_txt + " is - " + daysList[i].main.temp);
            }
            
            // data.list.forEach(function(eachData))
        });
}    

// chosenCity = JSON.parse(localStorage.getItem("savedCities"));

// localStorage.setItem("savedCities", JSON.stringify(savedCities));

function showCityList() {
    cityList.innerHTML = "";

    for (let i = 0; i < savedCities.length; i++) { 
    }
    console.log(cityList);
    let li = document.createElement("li");
    li.textContent = chosenCity

    cityList.appendChild(li);
}

function clearList() {
    
    savedCities = [];
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    showCityList();
}


init();

//create elements from javascript
//create array with data i want to loop - will give index number

//create a global empty array and asign array into a variable

//add event listener to search button 
//innerHTML

//get city names and save to local storage - local storage is an object - key and value pair
//set item happens when response comes back from API - set item accepts two arguements, 1. the key and 2. the value
//can be an array of strings or objects, i
//save the name of the city, use the name of the city
//if user types city twice, don't save it twice


//display city name with todays date and weather
//use every 8 indexes to get the 5 day forecast

//display 5 day weather forcast, add icons and dates

