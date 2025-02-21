// // import "../src/style.css";
// import { getWeather } from "../src/weather.js";
// import { ICON_MAP } from "../src/iconMap.js";

// let map; // Variável global para armazenar a instância do mapa

// // Request user's current geolocation
// navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

// // Success callback for geolocation, retrieves weather data
// function positionSuccess({ coords }) {
//   // Initialize the map with the user's location
//   initMap(coords.latitude, coords.longitude);

//   // Fetch weather data using the latitude, longitude, and timezone
//   getWeather(
//     coords.latitude,
//     coords.longitude,
//     Intl.DateTimeFormat().resolvedOptions().timeZone
//   )
//     .then(renderWeather) // If successful, render the weather data
//     .catch((e) => {
//       console.error(e); // Log error to console
//       alert("Error getting weather."); // Show error message
//     });
// }

// // Error callback for geolocation, informs user of the issue
// function positionError() {
//   alert(
//     "There was an error getting your location. Please allow us to use your location and refresh the page."
//   );
// }

// function initMap(latitude, longitude) {
//   const mapContainer = document.getElementById("map");

//   if (!mapContainer) {
//     console.error("Map container not found!");
//     return;
//   }

//   if (map) {
//     map.setView([latitude, longitude], 13); // Atualiza a visualização
//     return;
//   }

//   // Inicialize o mapa com um zoom adequado para dispositivos móveis
//   map = L.map("map").setView([latitude, longitude], 13); // Zoom inicial 13

//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "© OpenStreetMap contributors",
//   }).addTo(map);

//   L.marker([latitude, longitude])
//     .addTo(map)
//     .bindPopup("Your location")
//     .openPopup();
// }

// // Render weather data (current, daily, hourly)
// function renderWeather({ current, daily, hourly }) {
//   renderCurrentWeather(current); // Render current weather
//   renderDailyWeather(daily); // Render daily forecast
//   renderHourlyWeather(hourly); // Render hourly forecast
//   document.body.classList.remove("blurred"); // Remove blur effect after data is loaded
// }

// // Helper function to set text content in an element identified by a data attribute
// function setValue(selector, value, { parent = document } = {}) {
//   parent.querySelector(`[data-${selector}]`).textContent = value;
// }

// // Function to get the icon URL based on the icon code
// function getIconUrl(iconCode) {
//   return `icons/${ICON_MAP.get(iconCode)}.svg`; // Map icon code to SVG file path
// }

// const currentIcon = document.querySelector("[data-current-icon]");

// // Render current weather details
// function renderCurrentWeather(current) {
//   currentIcon.src = getIconUrl(current.iconCode); // Set icon for current weather
//   setValue("current-temp", current.currentTemp); // Set current temperature
//   setValue("current-high", current.highTemp); // Set high temperature
//   setValue("current-low", current.lowTemp); // Set low temperature
//   setValue("current-fl-high", current.highFeelsLike); // Set high feels-like temperature
//   setValue("current-fl-low", current.lowFeelsLike); // Set low feels-like temperature
//   setValue("current-wind", current.windSpeed); // Set wind speed
//   setValue("current-precip", current.precip); // Set precipitation
// }

// const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
// const dailySection = document.querySelector("[data-day-section]");
// const dayCardTemplate = document.getElementById("day-card-template");

// // Render daily weather forecast
// function renderDailyWeather(daily) {
//   dailySection.innerHTML = ""; // Clear previous daily data
//   daily.forEach((day) => {
//     const element = dayCardTemplate.content.cloneNode(true); // Clone the day card template
//     setValue("temp", day.maxTemp, { parent: element }); // Set max temperature for the day
//     setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element }); // Set day of the week
//     element.querySelector("[data-icon]").src = getIconUrl(day.iconCode); // Set day icon
//     dailySection.append(element); // Append the day card to the section
//   });
// }

// const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" });
// const hourlySection = document.querySelector("[data-hour-section]");
// const hourRowTemplate = document.getElementById("hour-row-template");

// // Render hourly weather forecast
// function renderHourlyWeather(hourly) {
//   hourlySection.innerHTML = ""; // Clear previous hourly data
//   hourly.forEach((hour) => {
//     const element = hourRowTemplate.content.cloneNode(true); // Clone the hour row template
//     setValue("temp", hour.temp, { parent: element }); // Set temperature for the hour
//     setValue("fl-temp", hour.feelsLike, { parent: element }); // Set feels-like temperature for the hour
//     setValue("wind", hour.windSpeed, { parent: element }); // Set wind speed for the hour
//     setValue("precip", hour.precip, { parent: element }); // Set precipitation for the hour
//     setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element }); // Set day
//     setValue("time", HOUR_FORMATTER.format(hour.timestamp), {
//       parent: element,
//     }); // Set hour of the day
//     element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode); // Set hourly icon
//     hourlySection.append(element); // Append the hour row to the section
//   });
// }

// function atualizarDataHora() {
//   const agora = new Date();
//   const opcoes = {
//     weekday: "long",
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   };
//   document.getElementById("datetime").textContent = agora.toLocaleDateString(
//     "en-US",
//     opcoes
//   );
// }

// atualizarDataHora();
// setInterval(atualizarDataHora, 1000);


import { getWeather } from "../src/weather.js";
import { ICON_MAP } from "../src/iconMap.js";

let map; // Global variable to store map instance

// Request user's current geolocation
navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

// Success callback for geolocation, retrieves weather data
function positionSuccess({ coords }) {
  // Initialize the map with the user's location
  initMap(coords.latitude, coords.longitude);

  // Fetch weather data using the latitude, longitude, and timezone
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then(renderWeather) // If successful, render the weather data
    .catch((e) => {
      console.error(e); // Log error to console
      alert("Error getting weather."); // Show error message
    });
}

// Error callback for geolocation, informs user of the issue
function positionError() {
  alert(
    "There was an error getting your location. Please allow us to use your location and refresh the page."
  );
}

// Initialize the map with the user's location
function initMap(latitude, longitude) {
  const mapContainer = document.getElementById("map");

  if (!mapContainer) {
    console.error("Map container not found!");
    return;
  }

  if (map) {
    map.setView([latitude, longitude], 13); // Update map view
    return;
  }

  // Initialize the map with an appropriate zoom level for mobile devices
  map = L.map("map").setView([latitude, longitude], 13); // Initial zoom level 13

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("Your location")
    .openPopup();
}

// Render weather data (current, daily, hourly)
function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current); // Render current weather
  renderDailyWeather(daily); // Render daily forecast
  renderHourlyWeather(hourly); // Render hourly forecast
  document.body.classList.remove("blurred"); // Remove blur effect after data is loaded
}

// Helper function to set text content in an element identified by a data attribute
function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

// Function to get the icon URL based on the icon code
function getIconUrl(iconCode) {
  const iconName = ICON_MAP.get(iconCode); // Get the icon name from ICON_MAP using the code
  if (iconName) {
    return `icons/${iconName}.svg`; // Return the path to the icon file
  } else {
    return "icons/default-icon.svg"; // Fallback in case no icon is found
  }
}

const currentIcon = document.querySelector("[data-current-icon]");

// Render current weather details
function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode); // Set icon for current weather
  setValue("current-temp", current.currentTemp); // Set current temperature
  setValue("current-high", current.highTemp); // Set high temperature
  setValue("current-low", current.lowTemp); // Set low temperature
  setValue("current-fl-high", current.highFeelsLike); // Set high feels-like temperature
  setValue("current-fl-low", current.lowFeelsLike); // Set low feels-like temperature
  setValue("current-wind", current.windSpeed); // Set wind speed
  setValue("current-precip", current.precip); // Set precipitation
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long" });
const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");

// Render daily weather forecast
function renderDailyWeather(daily) {
  dailySection.innerHTML = ""; // Clear previous daily data
  daily.forEach((day) => {
    const element = dayCardTemplate.content.cloneNode(true); // Clone the day card template
    setValue("temp", day.maxTemp, { parent: element }); // Set max temperature for the day
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element }); // Set day of the week
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode); // Set day icon
    dailySection.append(element); // Append the day card to the section
  });
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" });
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");

// Render hourly weather forecast
function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = ""; // Clear previous hourly data
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true); // Clone the hour row template
    setValue("temp", hour.temp, { parent: element }); // Set temperature for the hour
    setValue("fl-temp", hour.feelsLike, { parent: element }); // Set feels-like temperature for the hour
    setValue("wind", hour.windSpeed, { parent: element }); // Set wind speed for the hour
    setValue("precip", hour.precip, { parent: element }); // Set precipitation for the hour
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element }); // Set day
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), {
      parent: element,
    }); // Set hour of the day
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode); // Set hourly icon
    hourlySection.append(element); // Append the hour row to the section
  });
}

// Function to update the date and time dynamically
function atualizarDataHora() {
  const agora = new Date();
  const opcoes = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  document.getElementById("datetime").textContent = agora.toLocaleDateString(
    "en-US",
    opcoes
  );
}

atualizarDataHora();
setInterval(atualizarDataHora, 1000);
