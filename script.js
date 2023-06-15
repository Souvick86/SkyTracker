function addErrorMessageFunction(message) {
    const closeModal = document.querySelector('.closeModal');
    const dialog = document.querySelector('.dialog');
    addErrorMessage.textContent = message;
    dialog.showModal();

    closeModal.addEventListener('click', () => {
        dialog.close('open')
    })

    dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect()
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          dialog.close()
        }
      })
}


const button = document.getElementById('submit');
const temp = document.querySelector('.temp');
const feelsLike = document.querySelector('.feels_like');
const humidity = document.querySelector('.humidity');
const pressure = document.querySelector('.pressure');
const windspeed = document.querySelector('.windspeed');
const mainCity = document.querySelector('.city');
const cityLocation = document.querySelector('.icon1');
const weatherImage = document.querySelector('.weatherImage');
const weatherDesc = document.querySelector('.weatherDesc');
const addErrorMessage = document.querySelector('.addErrorMessage');


// Default set to Kolkata.
let weatherApi = '522c209c17e0fbcf57178df5d848893a';
let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=kolkata&appid=${weatherApi}&units=metric`;

async function weather() {
    try {
        let response = await fetch(weatherUrl);
        let data = await response.json();
        if (data.message === 'city not found') {
            addErrorMessageFunction(`Couldn't find the city Name.`);
        } else if (data.cod === 401) {
            addErrorMessageFunction(`Authentication Error: invalid API key.`);
        } else {
            temp.innerHTML = `${parseInt(data.main.temp)}<sup>°C</sup>`;
            feelsLike.innerHTML = `Feels like ${parseInt(data.main.feels_like)}<sup>°C</sup>`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
            windspeed.textContent = `Wind Speed: ${data.wind.speed} km/h`;
            pressure.textContent = `Pressure: ${data.main.pressure}`;
            cityLocation.innerHTML += `Kolkata`;
            weatherDesc.textContent = data.weather[0].main;
        }
    } catch (error) {
        console.log(`There's an error in the fetch API`);
    }
}

weather();

// When the button is clicked.
button.addEventListener('click', async (e) => {
    e.preventDefault();

    const weatherCityInput = document.getElementById('textInput');
    const weatherCity = weatherCityInput.value.trim();

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    if (weatherCity === '' || !isNaN(weatherCity)) {
        addErrorMessageFunction('Please enter a valid city name.');
        weatherCityInput.value = '';
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${weatherCity}&appid=${weatherApi}&units=metric`;

    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();

        if (data.message === 'city not found') {
            const errorMessage = `Couldn't find the city "${weatherCity}", please double-check.`;
            addErrorMessageFunction(errorMessage);
            weatherCityInput.value ='';
        } else if (data.cod === 401) {
            addErrorMessageFunction('Authentication Error: invalid API key.');
            weatherCityInput.value ='';
        } else {
            temp.innerHTML = `${parseInt(data.main.temp)}<sup>°C</sup>`;
            feelsLike.innerHTML = `Feels like ${parseInt(data.main.feels_like)}<sup>°C</sup>`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
            windspeed.textContent = `Wind Speed: ${data.wind.speed} km/h`;
            pressure.textContent = `Pressure: ${data.main.pressure}`;
            mainCity.textContent = `Weather in ${capitalizeFirstLetter(weatherCity)}`;
            cityLocation.innerHTML = `<ion-icon name="location-outline"></ion-icon> ${capitalizeFirstLetter(weatherCity)}`;

            if (data.weather[0].main === 'Thunderstorm') {
                weatherImage.src = 'https://openweathermap.org/img/wn/11d@2x.png';
                weatherDesc.textContent = 'Thunderstorm';
            } else if (data.weather[0].main === 'Drizzle') {
                weatherImage.src = 'https://openweathermap.org/img/wn/09d@2x.png';
                weatherDesc.textContent = 'Drizzle';
            } else if (data.weather[0].main === 'Rain') {
                if (['light rain', 'moderate rain', 'heavy intensity rain', 'very heavy rain', 'extreme rain'].includes(data.weather[0].description)) {
                    weatherImage.src = 'https://openweathermap.org/img/wn/10d@2x.png';
                } else if (['light intensity shower rain', 'shower rain', 'heavy intensity shower rain', 'ragged shower rain'].includes(data.weather[0].description)) {
                    weatherImage.src = 'https://openweathermap.org/img/wn/09d@2x.png';
                } else {
                    weatherImage.src = 'https://openweathermap.org/img/wn/13d@2x.png';
                }
                weatherDesc.textContent = 'Rain';
            } else if (data.weather[0].main === 'Snow') {
                weatherImage.src = 'https://openweathermap.org/img/wn/13d@2x.png';
                weatherDesc.textContent = 'Snow';
            } else if (data.weather[0].main === 'Clear') {
                weatherImage.src = 'https://openweathermap.org/img/wn/01d@2x.png';
                weatherDesc.textContent = 'Clear';
            } else if (data.weather[0].main === 'Clouds') {
                if (data.weather[0].description === 'few clouds: 11-25%') {
                    weatherImage.src = 'https://openweathermap.org/img/wn/02d@2x.png';
                } else if (data.weather[0].description === 'scattered clouds: 25-50%') {
                    weatherImage.src = 'https://openweathermap.org/img/wn/03d@2x.png';
                } else {
                    weatherImage.src = 'https://openweathermap.org/img/wn/04n@2x.png';
                }
                weatherDesc.textContent = 'Clouds';
            } else {
                weatherImage.src = 'https://openweathermap.org/img/wn/50d@2x.png';
                weatherDesc.textContent = data.weather[0].main;
            }

            // Reset the input field
            weatherCityInput.value = '';
        }
    } catch (error) {
        console.error(`Error occurred during the fetch request: ${error}`);
    }
});




//for time reference.
const datetime = document.querySelector('.datetime');
const date = document.querySelector('.date');

setInterval(() => {
    let data = new Date();
    let today = data.toLocaleString('en-US', { weekday: 'long' });
    let hours = data.getHours();
    let minutes = data.getMinutes();

    // Add leading zeros to hours and minutes if they are single digits
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');

    datetime.textContent = `${hours}:${minutes}`;
    date.textContent = today;
}, 1000);