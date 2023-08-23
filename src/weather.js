const weather = (() => {
  const API_KEY = '1686fcdfeabc43b49b380859232807';

  const convertForecastData = (forecastday) => forecastday.map((dayData) => {
    const {
      date: forecastDate,
      day: {
        maxtemp_f: forecastTempF,
        maxtemp_c: forecastTempC,
        avghumidity: forecastHumidity,
        maxwind_kph: forecastWindSpeed,
        condition: { text: forecastWeather },
      },
    } = dayData;

    return {
      forecastDate,
      forecastTempF,
      forecastTempC,
      forecastHumidity,
      forecastWindSpeed,
      forecastWeather,
    };
  });

  const convertWeatherData = (data) => {
    const {
      location: {
        name: cityName,
        country: selectedCountry,
        localtime: currentDate,
      },
      current: {
        temp_c: currentTempC,
        temp_f: currentTempF,
        feelslike_f: feelsLikeF,
        feelslike_c: feelsLikeC,
        humidity,
        wind_kph: windSpeed,
        condition: { text: currentWeather },
      },
      forecast: { forecastday },
    } = data;

    const [...forecast] = convertForecastData(forecastday);

    return {
      cityName,
      selectedCountry,
      currentDate,
      currentTempC,
      currentTempF,
      feelsLikeF,
      feelsLikeC,
      humidity,
      windSpeed,
      currentWeather,
      forecast,
    };
  };

  const fetchWeatherData = async (location) => {
    try {
      const endpoint = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location.toUpperCase()}&days=3&aqi=no&alerts=no`;
      const response = await fetch(endpoint, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`${location} is not found`);
      }
      const weatherData = convertWeatherData(await response.json());

      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  return {
    fetchWeatherData,
  };
})();

export default weather;
