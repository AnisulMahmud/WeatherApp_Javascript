
// Function to fetch the weather data from the API
window.onload = function() {
function DateTime(){
    const now = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[now.getMonth()];
    const day = now.getDate();
    let hours = now.getHours();
    const minutes = now.getMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const finalTime =  hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;

    const final= monthName + ' ' + day + ', ' + finalTime;
    document.getElementById('liveTime').innerHTML = final;
    

}
setTimeout(DateTime);
}


const apiKey = '23a54643d49faf711fbbd48521054055'


// Function to fetch the weather data from the API
async function weatherResponse(cityName) {
    try {
        const geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`);
        const data = await geoResponse.json();
        const lat = data[0].lat;
        const lon = data[0].lon;

        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const weatherData = await weatherResponse.json();

        
        return weatherData;
    } catch (error) {
        console.log('Error', error);
    }
}


let weatherData = null;

// Default city
let cityName= 'Tampere';
document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${cityName}')`;


// Event listener for the search button
document.querySelector('.submit').addEventListener('click', async function() {
    cityName = document.querySelector('.search').value; 
    weatherData = await weatherResponse(cityName); 
    console.log(weatherData);
    
    // for updating the background image with the city name
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${cityName}')`;
    updateTemperature();
});

// Event listener for the  enter key
document.querySelector('.search').addEventListener('keypress', async function(event){

    if(event.key==='Enter'){
        cityName = document.querySelector('.search').value; 
        weatherData = await weatherResponse(cityName); 
        console.log(weatherData);
        
        // for updating the background image with the city name
        document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${cityName}')`;
        updateTemperature();
    }
})

// Event listener for the temperature toggle
document.querySelector('#temp-toggle').addEventListener('change', function() {
    if (weatherData) {
        updateTemperature();
    }
});

// Function to convert the time from Unix to human-readable time
function converTime(time, timezone) {
    const date = new Date((time + timezone) * 1000);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes; 
    const finalTime =  hours + ':' + minutes + ' ' + ampm;
    return finalTime;
}

function updateTemperature() {
    const city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    const countryName = weatherData.sys.country;
    

    const temp = weatherData.main.temp;
    const tempToggle = document.querySelector('#temp-toggle');
    let tempCelsius = Math.round(temp - 273.15);
    let tempFahrenheit = Math.round(tempCelsius * 9/5) + 32;


    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
    const iconImg = document.createElement('img');
    iconImg.className = 'weather-icon'; 
    iconImg.src = iconUrl;
    iconImg.style.width = '50px';
    iconImg.style.height = '50px';
    iconImg.style.position ='relative';

    const desc = weatherData.weather[0].description;

    let feelsLike = weatherData.main.feels_like;
    let feelsLikeCelsius = Math.round(feelsLike - 273.15);
    let feelsLikeFahrenheit = Math.round(feelsLikeCelsius * 9/5) + 32;

    const humidity = weatherData.main.humidity;

    const windSpeed = weatherData.wind.speed;

    const visiblity =  weatherData.visibility;

    const  rise = converTime(weatherData.sys.sunrise, weatherData.timezone);
    const  set = converTime(weatherData.sys.sunset, weatherData.timezone);


    const countryNameEl = document.querySelector('.country-name');
    console.log(countryNameEl);
    countryNameEl.textContent = `Weather in ${city}, ${countryName}`;
    const weatherDesc = document.querySelector('.weather-desc');

    const temperature = document.querySelector('.temperature');
    temperature.innerHTML = '';

    const desEl = document.querySelector('.description');
    desEl.textContent = desc.toUpperCase();

    const feelsLikeEl = document.querySelector('#feels-like-temp');
    feelsLikeEl.innerHTML = `Feels like:`;
    

    const humidityEl = document.querySelector('#humidi');
    humidityEl.textContent = ` ${humidity}%`;

    const windSpeedEl = document.querySelector('#wind');
    windSpeedEl.textContent  = ` ${windSpeed} m/s`;

    const visiblityEl = document.querySelector('#visible');
    visiblityEl.textContent  = ` ${visiblity/1000} km`;

    const sunriseEl = document.querySelector('#sunrise');
    sunriseEl.textContent  = ` ${rise}`;

    const sunsetEl = document.querySelector('#sunset');
    sunsetEl.textContent = ` ${set}`;


    if (tempToggle.checked) {
        // If it's checked, display the temperature in Fahrenheit
        temperature.innerHTML = iconImg.outerHTML + tempFahrenheit + '°F';
        feelsLikeEl.innerHTML += ` ${feelsLikeFahrenheit}°F`;
    } else {
        // If it's not checked, display the temperature in Celsius
        temperature.innerHTML = iconImg.outerHTML + tempCelsius + '°C';
        feelsLikeEl.innerHTML += ` ${feelsLikeCelsius}°C`;
    }

    document.querySelector('#weather-info').classList.remove('hidden');
}


// Setting a fixed city to display the weather on page load
// async function defaultWeather() {
//     weatherData = await weatherResponse(cityName);
//     updateTemperature();
// }

// document.addEventListener('DOMContentLoaded', (event) => {
//     defaultWeather();
// });