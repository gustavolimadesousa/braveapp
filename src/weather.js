import axios from "axios";

// Function to fetch weather data based on latitude, longitude, and timezone
export function getWeather(lat, lon, timezone) {
  return axios
    .get(
      "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm&timeformat=unixtime",
      {
        params: {
          latitude: lat, // Latitude of the location
          longitude: lon, // Longitude of the location
          timezone, // Timezone for the location
        },
      }
    )
    .then(({ data }) => {
      // Verifique se os dados necessários estão presentes
      if (!data.current_weather || !data.daily || !data.hourly) {
        throw new Error("Invalid weather data received from API");
      }

      // Return parsed data for current, daily, and hourly weather
      return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data),
      };
    });
}

// Function to parse current weather data and extract necessary values
function parseCurrentWeather({ current_weather, daily }) {
  // Verifique se os dados necessários estão presentes
  if (!current_weather || !daily) {
    throw new Error("Invalid current weather data");
  }

  const {
    temperature: currentTemp, // Current temperature
    windspeed: windSpeed, // Current wind speed
    weathercode: iconCode, // Weather icon code for current weather
  } = current_weather;

  const {
    temperature_2m_max: [maxTemp], // Maximum temperature of the day
    temperature_2m_min: [minTemp], // Minimum temperature of the day
    apparent_temperature_max: [maxFeelsLike], // Maximum feels like temperature of the day
    apparent_temperature_min: [minFeelsLike], // Minimum feels like temperature of the day
    precipitation_sum: [precip], // Total precipitation for the day
  } = daily;

  // Return parsed data with rounded values
  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(maxFeelsLike),
    lowFeelsLike: Math.round(minFeelsLike),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100, // Round to 2 decimal places
    iconCode, // Current weather icon code
  };
}

// Function to parse daily weather data and extract necessary values
function parseDailyWeather({ daily }) {
  if (
    !daily ||
    !daily.time ||
    !daily.weathercode ||
    !daily.temperature_2m_max
  ) {
    throw new Error("Invalid daily weather data");
  }

  return daily.time.map((time, index) => {
    // Map over each daily timestamp and return necessary data for each day
    return {
      timestamp: time * 1000, // Convert timestamp from UNIX time to milliseconds
      iconCode: daily.weathercode[index], // Weather icon code for the day
      maxTemp: Math.round(daily.temperature_2m_max[index]), // Max temperature for the day
    };
  });
}

// Function to parse hourly weather data and filter by current weather time
function parseHourlyWeather({ hourly, current_weather }) {
  if (!hourly || !hourly.time || !current_weather) {
    throw new Error("Invalid hourly weather data");
  }

  return (
    hourly.time
      .map((time, index) => {
        // Map over each hourly timestamp and extract necessary values
        return {
          timestamp: time * 1000, // Convert timestamp from UNIX time to milliseconds
          iconCode: hourly.weathercode[index], // Weather icon code for the hour
          temp: Math.round(hourly.temperature_2m[index]), // Temperature for the hour
          feelsLike: Math.round(hourly.apparent_temperature[index]), // Feels like temperature for the hour
          windSpeed: Math.round(hourly.windspeed_10m[index]), // Wind speed for the hour
          precip: Math.round(hourly.precipitation[index] * 100) / 100, // Precipitation for the hour (rounded to 2 decimal places)
        };
      })
      // Filter out hourly data that is before the current weather time
      .filter(({ timestamp }) => timestamp >= current_weather.time * 1000)
  );
}
