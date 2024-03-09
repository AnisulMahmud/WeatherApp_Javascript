
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
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const finalTime =  hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;

    const final= monthName + ' ' + day + ', ' + finalTime;
    document.getElementById('liveTime').innerHTML = final;
    

}
setTimeout(DateTime);
}


const apiKey = '23a54643d49faf711fbbd48521054055'



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

document.querySelector('.submit').addEventListener('click', async function() {
    const cityName = document.querySelector('.search').value; 
    const weatherData = await weatherResponse(cityName); // Make sure to await this function
    console.log(weatherData);

     const countryName = weatherData.sys.country;
    const desc = weatherData.weather[0].description;
    const temp = weatherData.main.temp;
    const tempCelsius = Math.round(temp - 273.15);
    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    const iconImg = document.createElement('img');
    iconImg.src = iconUrl;

    const temperature = document.querySelector('.temperature');
    temperature.innerHTML = iconImg.outerHTML + tempCelsius + '°C';
});



