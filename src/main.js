import { getWeather } from "../src/weather.js";
import { ICON_MAP } from "../src/iconMap.js";

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const suggestionsList = document.getElementById("suggestions");
const searchContainer = document.querySelector(".search-container");

// Global variables for map and marker
let map;
let marker;

// Track mouse state
let isMouseOverSearchContainer = false;

// Function to fetch coordinates and city name using Open-Meteo Geocoding API
async function getCoordinates(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { latitude, longitude, timezone, name } = data.results[0];
      return { latitude, longitude, timezone, name }; // Include the city name
    } else {
      throw new Error("No results found for the given location.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
}

// Function to fetch city name using reverse geocoding
async function getCityName(latitude, longitude) {
  const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].name; // Return the city name
    } else {
      return "Your location"; // Fallback if no city name is found
    }
  } catch (error) {
    console.error("Error fetching city name:", error);
    return "Your location"; // Fallback in case of error
  }
}

// Function to fetch unique location suggestions
async function getSuggestions(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query
  )}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Use a Set to store unique location names
      const uniqueSuggestions = new Set(
        data.results.map((result) => result.name)
      );
      return Array.from(uniqueSuggestions); // Convert Set back to an array
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

// Function to initialize or update the map
function initMap(latitude, longitude, cityName) {
  const mapContainer = document.getElementById("map");

  if (!mapContainer) {
    console.error("Map container not found!");
    return;
  }

  // If the map already exists, update its view and marker
  if (map) {
    map.setView([latitude, longitude], 13); // Update map view
    marker.setLatLng([latitude, longitude]); // Update marker position
    marker.setPopupContent(cityName); // Update popup text
    return;
  }

  // Initialize the map if it doesn't exist
  map = L.map("map").setView([latitude, longitude], 13); // Initial zoom level 13

  // Add the tile layer (map tiles)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Add a marker for the searched location
  marker = L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup(cityName) // Set popup text to the city name
    .openPopup();
}

// Event Listener for Input Changes
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();

  if (query.length >= 3) {
    const suggestions = await getSuggestions(query);
    suggestionsList.innerHTML = ""; // Clear previous suggestions

    // Add unique suggestions to the datalist
    suggestions.forEach((suggestion) => {
      const option = document.createElement("option");
      option.value = suggestion;
      suggestionsList.appendChild(option);
    });
  } else {
    suggestionsList.innerHTML = ""; // Clear suggestions if the input is too short
  }
});

// Event Listener for Mouse Entering the Search Container
searchContainer.addEventListener("mouseenter", () => {
  isMouseOverSearchContainer = true;
});

// Event Listener for Mouse Leaving the Search Container
searchContainer.addEventListener("mouseleave", () => {
  isMouseOverSearchContainer = false;
  setTimeout(() => {
    if (!isMouseOverSearchContainer) {
      suggestionsList.innerHTML = ""; // Clear suggestions after a delay
    }
  }, 300); // 300ms delay to allow interaction
});

// Event Listener for Mouse Entering the Suggestions Dropdown
suggestionsList.addEventListener("mouseenter", () => {
  isMouseOverSearchContainer = true;
});

// Event Listener for Mouse Leaving the Suggestions Dropdown
suggestionsList.addEventListener("mouseleave", () => {
  isMouseOverSearchContainer = false;
  setTimeout(() => {
    if (!isMouseOverSearchContainer) {
      suggestionsList.innerHTML = ""; // Clear suggestions after a delay
    }
  }, 300); // 300ms delay to allow interaction
});

// Event Listener for Search Button
searchButton.addEventListener("click", async () => {
  const location = searchInput.value.trim();

  if (!location) {
    alert("Please enter a location.");
    return;
  }

  try {
    // Fetch coordinates and city name for the searched location
    const { latitude, longitude, timezone, name } = await getCoordinates(
      location
    );

    // Update the map with the new coordinates and city name
    initMap(latitude, longitude, name);

    // Fetch weather data using the coordinates
    const weather = await getWeather(latitude, longitude, timezone);

    // Render the weather data
    renderWeather(weather);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to fetch weather data. Please try again.");
  }
});

// Event Listener for Enter Key
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission (if applicable)
    searchButton.click(); // Trigger the search button click
  }
});

// Success callback for geolocation, retrieves weather data
async function positionSuccess({ coords }) {
  const { latitude, longitude } = coords;

  // Fetch the city name for the user's current location
  const cityName = await getCityName(latitude, longitude);

  // Initialize the map with the user's location and city name
  initMap(latitude, longitude, cityName);

  // Fetch weather data using the latitude, longitude, and timezone
  getWeather(
    latitude,
    longitude,
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

// Request user's current geolocation
navigator.geolocation.getCurrentPosition(positionSuccess, positionError);


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
    return `./src/icons/${iconName}.svg`; // Return the path to the icon file
  } else {
    return "./src/icons/default-icon.svg"; // Fallback in case no icon is found
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