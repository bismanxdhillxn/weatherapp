let currentUnit = 'C'; // Default unit is Celsius

function getWeather() {
    const apiKey = '05fbed87dcb14f28d24d435648b15d3f';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                alert(`City not found: ${city}`);
                return;
            }
            displayWeather(data);
            changeBackground(data.weather[0].main);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch hourly forecast
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== '200') {
                alert('Error fetching forecast data.');
                return;
            }
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const additionalInfoDiv = document.getElementById('additional-info');
    const sunInfoDiv = document.getElementById('sun-info');
    const weatherIcon = document.getElementById('weather-icon');
    
    const temperature = currentUnit === 'C' 
        ? Math.round(data.main.temp - 273.15) 
        : Math.round((data.main.temp - 273.15) * 9/5 + 32);
    
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Wind and Rain
    const windSpeed = data.wind.speed; // Wind speed in meters per second
    const rainChance = data.rain ? data.rain['1h'] : 0; // Chance of rain for the last hour
    
    // Sunrise and Sunset
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    // Display temperature, description, and icon
    tempDivInfo.innerHTML = `<p>${temperature}°${currentUnit}</p>`;
    weatherInfoDiv.innerHTML = `<p>${data.name}</p><p>${description}</p>`;
    weatherIcon.src = iconUrl;
    weatherIcon.style.display = 'block';

    // Display additional info (wind, rain, humidity)
    additionalInfoDiv.innerHTML = `
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Chance of Rain: ${rainChance ? rainChance + '%' : '0%'}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Pressure: ${data.main.pressure} hPa</p>
    `;

    // Display sunrise and sunset times
    sunInfoDiv.innerHTML = `
        <p>Sunrise: ${sunrise}</p>
        <p>Sunset: ${sunset}</p>
    `;
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; // Clear previous hourly forecast

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = currentUnit === 'C' 
            ? Math.round(item.main.temp - 273.15) 
            : Math.round((item.main.temp - 273.15) * 9/5 + 32);

        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°${currentUnit}</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function toggleUnit() {
    currentUnit = (currentUnit === 'C') ? 'F' : 'C'; // Toggle between Celsius and Fahrenheit
    const unitButton = document.getElementById('unit-toggle');
    unitButton.innerHTML = `Switch to °${currentUnit === 'C' ? 'F' : 'C'}`; // Update button text
    getWeather(); // Fetch new weather data with the updated unit
}

function changeBackground(weatherCondition) {
    const body = document.body;

    // Change background based on weather condition
    if (weatherCondition === 'Clear') {
        body.style.backgroundImage = 'url("clear-sky.jpg")'; // Example of an image URL
    } else if (weatherCondition === 'Rain' || weatherCondition === 'Drizzle') {
        body.style.backgroundImage = 'url("rainy-sky.jpg")';
    } else if (weatherCondition === 'Clouds') {
        body.style.backgroundImage = 'url("cloudy-sky.jpg")';
    } else {
        body.style.backgroundImage = 'url("default-weather.jpg")';
    }
}
