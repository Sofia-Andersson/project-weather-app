const cityPicker = document.getElementById('cityPicker');
cityPicker.addEventListener('change', event => {
  getCityData(event.target.value);
});

function getCityData(city) {
  console.log(city);

  const API_TODAY = `
https://api.openweathermap.org/data/2.5/weather?q=${city},Sweden&units=metric&APPID=7dee0e5a05b2c9d92a37a397279281ca
`;
  const API_FORECAST = `
https://api.openweathermap.org/data/2.5/forecast?q=${city},Sweden&units=metric&APPID=dfa433e7ce60074523483f09849d33d2
`;

  const sectionToday = document.getElementById('today');
  const sectionForecast = document.getElementById('forecast');
  const mainContainer = document.getElementById('main-container');
  const citySelect = document.getElementById('citySelect');

  fetch(API_TODAY)
    .then(response => response.json())
    .then(data => {
      console.log('today data:', data);

      // Date format is in milliseconds, so have to multiply it by 1000 to get a correct date using new Date()
      // slice() to use only hour and minutes from toLocaleTimeString()
      const sunrise = new Date(data.sys.sunrise * 1000)
        .toLocaleTimeString()
        .slice(0, 5);
      const sunset = new Date(data.sys.sunset * 1000)
        .toLocaleTimeString()
        .slice(0, 5);

      let imageSrc, weatherDescription;

      //removes all previous styling based on rain/clouds/clear, before adding styling for selected city's current weather (rain/cluds/clear).
      mainContainer.classList.remove('rain', 'clouds', 'clear');
      //does the same as above for the Select-element.
      citySelect.classList.remove(
        'city-select-rain',
        'city-select-clouds',
        'city-select-clear'
      );

      // Sets the image source, description text and styling based on the weather
      if (data.weather[0].main === 'Clear') {
        imageSrc = 'noun_Sunglasses_2055147.svg';
        weatherDescription = `Get your sunnies on. ${data.name} is looking rather great today.`;
        mainContainer.classList.add('clear');
        citySelect.classList.add('city-select-clear');
      } else if (data.weather[0].main === 'Rain') {
        imageSrc = 'noun_Umbrella_2030530.svg';
        weatherDescription = `Don't forget your umbrella. It's wet in ${data.name} today`;
        mainContainer.classList.add('rain');
        citySelect.classList.add('city-select-rain');
      } else {
        imageSrc = 'noun_Cloud_1188486.svg';
        weatherDescription = `Light a fire and get cosy. ${data.name} is looking grey today.`;
        mainContainer.classList.add('clouds');
        citySelect.classList.add('city-select-clouds');
      }

      // Changes the today HTML section based on today's weather data
      sectionToday.innerHTML = `
    <p class="today-temp">${data.weather[0].main} | ${data.main.temp.toFixed(
        1
      )}°</p>
    <p class="sunrise">sunrise ${sunrise}</p>
    <p class="sunset">sunset ${sunset}</p>
    <img class="weather-icon"
    src="./Designs/Design-2/icons/${imageSrc}"
  />
    <h1 class="today-title">${weatherDescription}</h1>
    `;
    });

  fetch(API_FORECAST)
    .then(response => response.json())
    .then(data => {
      console.log('forecast data:', data);

      // Remove the placeholder text from HTML
      sectionForecast.innerHTML = '';

      // Extracts only the data from noon each day
      const forecastDays = data.list.filter(day =>
        day.dt_txt.includes('12:00')
      );

      // Loops over forecastDays and injects the data into the forecast HTML section
      forecastDays.forEach(day => {
        // Date format in each day object is in milliseconds under "dt", so have to multiply it by 1000 to get a correct date using new Date()
        const date = new Date(day.dt * 1000);

        // Extracts only the first 3 letters in the full date string that looks for example like this:
        // Thu Sep 08 2022 14:00:00 GMT+0200
        const weekday = String(date).slice(0, 3).toLowerCase();

        sectionForecast.innerHTML += `
      <div class="forecast-day-container">
       <p class="forecast-day">${weekday}</p>
       <p class="forecast-day-temp">${day.main.temp.toFixed(1)}°</p>
      </div>
      `;
      });
    });
}
getCityData('Gothenburg');
