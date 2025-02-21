// // import axios from "axios";

// // Function to fetch weather data based on latitude, longitude, and timezone
// export function getWeather(lat, lon, timezone) {
//   return axios
//     .get(
//       "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm&timeformat=unixtime",
//       {
//         params: {
//           latitude: lat,
//           longitude: lon,
//           timezone,
//         },
//       }
//     )
//     .then(({ data }) => {
//       // Ensure valid data exists
//       if (!data.current_weather || !data.daily || !data.hourly) {
//         throw new Error("Invalid weather data received from API");
//       }

//       // Return parsed weather data
//       return {
//         current: parseCurrentWeather(data),
//         daily: parseDailyWeather(data),
//         hourly: parseHourlyWeather(data),
//       };
//     });
// }

// // Parse current weather data
// function parseCurrentWeather({ current_weather, daily }) {
//   if (!current_weather || !daily) {
//     throw new Error("Invalid current weather data");
//   }

//   const {
//     temperature: currentTemp,
//     windspeed: windSpeed,
//     weathercode: iconCode,
//   } = current_weather;

//   const {
//     temperature_2m_max: [maxTemp],
//     temperature_2m_min: [minTemp],
//     apparent_temperature_max: [maxFeelsLike],
//     apparent_temperature_min: [minFeelsLike],
//     precipitation_sum: [precip],
//   } = daily;

//   return {
//     currentTemp: Math.round(currentTemp),
//     highTemp: Math.round(maxTemp),
//     lowTemp: Math.round(minTemp),
//     highFeelsLike: Math.round(maxFeelsLike),
//     lowFeelsLike: Math.round(minFeelsLike),
//     windSpeed: Math.round(windSpeed),
//     precip: Math.round(precip * 100) / 100,
//     iconCode,
//   };
// }

// // Parse daily weather data
// function parseDailyWeather({ daily }) {
//   if (
//     !daily ||
//     !daily.time ||
//     !daily.weathercode ||
//     !daily.temperature_2m_max
//   ) {
//     throw new Error("Invalid daily weather data");
//   }

//   return daily.time.map((time, index) => ({
//     timestamp: time * 1000, // Convert timestamp
//     iconCode: daily.weathercode[index],
//     maxTemp: Math.round(daily.temperature_2m_max[index]),
//   }));
// }

// // Parse hourly weather data
// function parseHourlyWeather({ hourly, current_weather }) {
//   if (!hourly || !hourly.time || !current_weather) {
//     throw new Error("Invalid hourly weather data");
//   }

//   return hourly.time
//     .map((time, index) => ({
//       timestamp: time * 1000,
//       iconCode: hourly.weathercode[index],
//       temp: Math.round(hourly.temperature_2m[index]),
//       feelsLike: Math.round(hourly.apparent_temperature[index]),
//       windSpeed: Math.round(hourly.windspeed_10m[index]),
//       precip: Math.round(hourly.precipitation[index] * 100) / 100,
//     }))
//     .filter(({ timestamp }) => timestamp >= current_weather.time * 1000);
// }

// Function to fetch weather data based on latitude, longitude, and timezone
export function getWeather(lat, lon, timezone) {
  // Construct the API URL with query parameters
  const url = `https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm&timeformat=unixtime&latitude=${lat}&longitude=${lon}&timezone=${timezone}`;

  // Use the Fetch API to make the request
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      // Ensure valid data exists
      if (!data.current_weather || !data.daily || !data.hourly) {
        throw new Error("Invalid weather data received from API");
      }

      // Return parsed weather data
      return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data),
      };
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      throw error; // Re-throw the error for handling in the calling code
    });
}

// Parse current weather data
function parseCurrentWeather({ current_weather, daily }) {
  if (!current_weather || !daily) {
    throw new Error("Invalid current weather data");
  }

  const {
    temperature: currentTemp,
    windspeed: windSpeed,
    weathercode: iconCode,
  } = current_weather;

  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    apparent_temperature_max: [maxFeelsLike],
    apparent_temperature_min: [minFeelsLike],
    precipitation_sum: [precip],
  } = daily;

  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(maxFeelsLike),
    lowFeelsLike: Math.round(minFeelsLike),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
    iconCode,
  };
}

// Parse daily weather data
function parseDailyWeather({ daily }) {
  if (
    !daily ||
    !daily.time ||
    !daily.weathercode ||
    !daily.temperature_2m_max
  ) {
    throw new Error("Invalid daily weather data");
  }

  return daily.time.map((time, index) => ({
    timestamp: time * 1000, // Convert timestamp to milliseconds
    iconCode: daily.weathercode[index],
    maxTemp: Math.round(daily.temperature_2m_max[index]),
  }));
}

// Parse hourly weather data
function parseHourlyWeather({ hourly, current_weather }) {
  if (!hourly || !hourly.time || !current_weather) {
    throw new Error("Invalid hourly weather data");
  }

  return hourly.time
    .map((time, index) => ({
      timestamp: time * 1000, // Convert timestamp to milliseconds
      iconCode: hourly.weathercode[index],
      temp: Math.round(hourly.temperature_2m[index]),
      feelsLike: Math.round(hourly.apparent_temperature[index]),
      windSpeed: Math.round(hourly.windspeed_10m[index]),
      precip: Math.round(hourly.precipitation[index] * 100) / 100,
    }))
    .filter(({ timestamp }) => timestamp >= current_weather.time * 1000); // Filter out past hours
}
