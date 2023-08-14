import { format, parseISO } from 'date-fns';
import weather from './weather';

const icons = {
  rain: '🌧️',
  drizzle: '🌧️',
  overcast: '☁️',
  mist: '☁️',
  clear: '⛅️',
  cloudy: '⛅️',
  sunny: '☀️',
  default: 'Error',
};

const imageUrls = {
  rain: 'images/raining.jpeg',
  drizzle: 'images/raining.jpeg',
  overcast: 'images/cloudy.jpeg',
  cloudy: 'images/cloudy.jpeg',
  clear: 'images/cloudy.jpeg',
  mist: 'images/cloudy.jpeg',
  sunny: 'images/sunny.jpeg',
  default: '',
};

const UI = async () => {
  const updateMainWeatherCard = async (data) => {
    const mainWeatherIcon = document.querySelector('.today-weather-icon');
    const backgroundImage = document.querySelector('.left-info');
    const mainDay = document.querySelector('.day-full');
    const mainDate = document.querySelector('.date');
    const mainLocation = document.querySelector('.location');
    const mainCountry = document.querySelector('.country');
    const mainWeather = document.querySelector('.today-weather');
    const mainTemp = document.querySelector('.today-weather-temp');
    const mainFeelsLike = document.querySelector('.feels-like');
    const mainHumidity = document.querySelector('.humidity');
    const mainWindSpeed = document.querySelector('.wind-speed');

    const currentWeather = data.currentWeather.toLowerCase();
    const matchWeather = Object.keys(icons).find((key) => currentWeather.includes(key));
    const icon = icons[matchWeather];
    const imageUrl = imageUrls[matchWeather];

    const date = new Date(data.currentDate);
    const formattedDay = format(date, 'EEEE');
    const formattedDate = format(date, 'dd/MM/yy, HH:mm');
    const celsius = document.querySelector('.celsius');

    mainWeatherIcon.textContent = icon;
    backgroundImage.style.background = `url("${imageUrl}")`;
    backgroundImage.style.backgroundPosition = 'center';
    backgroundImage.style.backgroundSize = 'cover';
    mainDay.textContent = formattedDay;
    mainDate.textContent = formattedDate;
    mainLocation.textContent = data.cityName;
    mainCountry.textContent = data.selectedCountry;
    mainWeather.textContent = data.currentWeather;
    if (celsius.classList.contains('active')) {
      mainTemp.textContent = `${Math.round(data.currentTempC)}°C`;
      mainFeelsLike.textContent = `${Math.round(data.feelsLikeC)}°C`;
    } else {
      mainTemp.textContent = `${Math.round(data.currentTempF)}°F`;
      mainFeelsLike.textContent = `${Math.round(data.feelsLikeF)}°F`;
    }
    mainHumidity.textContent = `${data.humidity}%`;
    mainWindSpeed.textContent = `${data.windSpeed} kph`;
  };

  const loadForcastData = async (data) => {
    const forecastWeatherIcons = document.querySelectorAll('.weather-icon');
    const forecastDates = document.querySelectorAll('.day');
    const forecastTemps = document.querySelectorAll('.day-temp');
    const celsius = document.querySelector('.celsius');

    data.forecast.forEach((forecastItem, index) => {
      const {
        forecastDate, forecastTempF, forecastTempC, forecastWeather,
      } = forecastItem;
      const parsedForecastDate = parseISO(forecastDate);
      const formattedForecastDate = format(parsedForecastDate, 'EEE');

      forecastDates[index].textContent = formattedForecastDate;

      if (celsius.classList.contains('active')) {
        forecastTemps[index].textContent = `${Math.round(forecastTempC)}°C`;
      } else {
        forecastTemps[index].textContent = `${Math.round(forecastTempF)}°F`;
      }

      const matchWeather = Object.keys(icons).find((key) => forecastWeather.toLowerCase().includes(key));
      const icon = icons[matchWeather];
      forecastWeatherIcons[index].textContent = icon;
    });
  };

  const convertTemp = (data) => {
    const convertBtn = document.querySelector('.temp-convert');
    const celsius = document.querySelector('.celsius');
    const fahrenheit = document.querySelector('.fahrenheit');

    convertBtn.addEventListener('click', () => {
      if (celsius.classList.contains('active')) {
        celsius.classList.remove('active');
        fahrenheit.classList.add('active');
      } else {
        celsius.classList.add('active');
        fahrenheit.classList.remove('active');
      }

      updateMainWeatherCard(data);
      loadForcastData(data);
    });
  };

  const DEFAULT_LOCATION = 'london';
  const defaultWeather = await weather.fetchWeatherData(DEFAULT_LOCATION);
  convertTemp(defaultWeather);
  loadForcastData(defaultWeather);
  updateMainWeatherCard(defaultWeather);

  const searchInput = document.getElementById('search-location');
  const searchIcon = document.querySelector('.search-icon');

  const searchAndUpdateWeather = async () => {
    const location = searchInput.value.toUpperCase();
    if (location === '') return;

    const weatherData = await weather.fetchWeatherData(location);
    convertTemp(weatherData);
    updateMainWeatherCard(weatherData);
    loadForcastData(weatherData);
  };

  searchIcon.addEventListener('click', searchAndUpdateWeather);
  searchInput.addEventListener('search', searchAndUpdateWeather);

  const rightInfo = document.querySelector('.right-info');
  const toggleDisplayIcon = document.querySelector('.toggle-display');

  toggleDisplayIcon.addEventListener('click', () => {
    if (rightInfo.style.display === 'none') {
      rightInfo.style.display = 'flex';
      toggleDisplayIcon.src = './icons/right-arrow.png';
    } else {
      rightInfo.style.display = 'none';
      toggleDisplayIcon.src = './icons/left-arrow.png';
    }
  });
};

export default UI;
