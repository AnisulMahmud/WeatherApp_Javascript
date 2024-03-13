
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
let weatherData = null;
let forecastData = null;


// Default city
let cityName= 'Tampere';



async function weatherResponse(cityName) {
    try {
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`);
        const data = await geoResponse.json();
        const lat = data[0].lat;
        const lon = data[0].lon;
        console.log(lat, lon);

        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const weatherData = await weatherResponse.json();
      

        return weatherData;
    } catch (error) {
        console.log('Error', error);
    }
}


async function forecastResponse(cityName) {
    try {
        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`);
        const data = await geoResponse.json();
        const lat = data[0].lat;
        const lon = data[0].lon;
        console.log(lat, lon);



        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();

       

        
             
        return forecastData;
    } catch (error) {
        console.log('Error', error);
    }
}





// Fetch the weather data for the default city
(async function() {
    
    weatherData = await weatherResponse(cityName);
    
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${cityName}')`;
   
})();

// Event listener for the search button
document.querySelector('.submit').addEventListener('click', async function() {
    cityName = document.querySelector('.search').value; 
    weatherData = await weatherResponse(cityName); 
    forecastData = await forecastResponse(cityName);
  
    
    
    // for updating the background image with the city name
    document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${cityName}')`;
    updateTemperature();
    updateForecast(forecastData);
    dailyForecast(forecastData);

    document.querySelector('#weather-info').classList.remove('hidden');
    document.querySelector('#hourly-forecast').classList.remove('hidden');
  
    document.querySelector('#weather-info-right').classList.remove('hidden');
});

// Event listener for the  enter key
document.querySelector('.search').addEventListener('keypress', async function(event){

    if(event.key==='Enter'){
        cityName = document.querySelector('.search').value; 
        weatherData = await weatherResponse(cityName); 
        forecastData = await forecastResponse(cityName);

        // for updating the background image with the city name
        document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${cityName}')`;
        updateTemperature();
        updateForecast(forecastData);
        dailyForecast(forecastData);


        document.querySelector('#weather-info').classList.remove('hidden');
        document.querySelector('#hourly-forecast').classList.remove('hidden');
        document.querySelector('#weather-info-right').classList.remove('hidden');
    }
})

// Event listener for the temperature toggle
document.querySelector('#temp-toggle').addEventListener('change', function() {
    if (weatherData) {

        updateTemperature();
        updateForecast(forecastData);
        dailyForecast(forecastData);
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

function converHour(time) {
    
    const date = new Date((time) * 1000);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes; 
    const finalTime =  hours + ':' + minutes + ' ' + ampm;
    return finalTime;
}

function convertDate(dateString){
    const ndate = new Date(dateString);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[ndate.getUTCMonth()];
    const day = ndate.getUTCDate();
    const finalDate = monthName + ' ' + day;
    return finalDate;
}

function updateTemperature() {
    const city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    const countryName = weatherData.sys.country;
    const hourlyDiv = document.getElementById('hourly-forecast');
    hourlyDiv.innerHTML = '';

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
    document.querySelector('#weather-info-right').classList.remove('hidden');
    document.querySelector('#hourly-forecast').classList.remove('hidden');
    
}

// 5-day forecast
async function updateForecast(forecastData) {
    const tempToggle = document.querySelector('#temp-toggle');
    let tempCelsius = 0;
    let tempFahrenheit = 0;
 

    const hourlyDiv = document.getElementById('hourly-forecast');
  
   
    // free openweathermap API only provides data after every 3 hours interval
    const  dayForecast = forecastData.list.slice(0,8 )
 

    dayForecast.forEach((forecast) => {
        const time =  converHour(forecast.dt);
        const temp = forecast.main.temp;
        tempCelsius = Math.round(temp - 273.15);
        tempFahrenheit = Math.round(tempCelsius * 9/5) + 32;
        console.log(tempCelsius, tempFahrenheit);
        const iconCode = forecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
        const humidity = forecast.main.humidity;
        const windSpeed = forecast.wind.speed;
        const visiblity =  forecast.visibility;


        const hourlyHtml = `
        <div class="hourly-item">
            <span>${time}</span>
            <img class= "iconUrl" src="${iconUrl}" alt="weather icon">
            <div class="container">
                <img src="./img/temp.png">
                <span>${tempToggle.checked? tempFahrenheit +'°F' : tempCelsius +'°C'}</span>
            </div>
            
            <div class="container"> 
                <img src="./img/humidity.png">
                <span>${humidity}%</span>

            </div>

            <div class="container"> 
                <img src="./img/visibility.png">
                <span>${visiblity/1000}km</span>
            </div>        

        </div>
    `;
    hourlyDiv.innerHTML += hourlyHtml;

    });


    document.querySelector('#hourly-forecast').classList.remove('hidden');
    document.getElementById('daily-forecast').classList.remove('hidden');
}



async function dailyForecast(forecastData) {
    const tempToggle = document.querySelector('#temp-toggle');
    let tempMinCelsius = 0;
    let tempMinFahrenheit = 0;
    let tempMaxCelsius = 0;
    let tempMaxFahrenheit = 0;

    console.log(forecastData);

    const dailyDiv = document.getElementById('daily-forecast')
    dailyDiv.innerHTML = '';

    const dailyData = {}
    forecastData.list.forEach((dailyItem)=>{
        const date =  dailyItem.dt_txt.split(' ')[0];

        if(!dailyData[date]) {
            dailyData[date] = [dailyItem];
        
        } else{
            dailyData[date].push(dailyItem);
        
        }
    });

    for ( let date in dailyData) {
        let totalTempmin = 0
        let totalTempmax = 0
        let totalHumidity = 0

        dailyData[date].forEach((item)=>{
            totalTempmin += item.main.temp_min;
            totalTempmax += item.main.temp_max;
            totalHumidity += item.main.humidity;
        });

        const  tempmin = totalTempmin / dailyData[date].length;
        const  tempmax = totalTempmax / dailyData[date].length;
        const  humidity = Math.round(totalHumidity / dailyData[date].length);

        tempMinCelsius = Math.round(tempmin - 273.15);
        tempMinFahrenheit = Math.round(tempMinCelsius * 9/5) + 32;

        tempMaxCelsius = Math.round(tempmax - 273.15);
        tempMaxFahrenheit = Math.round(tempMaxCelsius * 9/5) + 32;

        const newdate =  convertDate(date)

        const dailyHtml = `
        <div class="daily-item">
           
            <span>${newdate}</span>
          
            <div class="container">
            <img src="./img/temp.png">
            <span>${tempToggle.checked? tempMaxFahrenheit +'°F' : tempMaxCelsius +'°C'}/${tempToggle.checked? tempMinFahrenheit +'°F' : tempMinCelsius +'°C'}</span>
            </div>

            

            <div class="container">
            <img src="./img/humidity.png">
            <span>${humidity}%</span>
            </div>
        </div>
    `;
    dailyDiv.innerHTML += dailyHtml;
    


    }
  
   
  
    document.querySelector('#weather-info-right').classList.remove('hidden');

}




