// Create a new Map to store weather code-to-icon mappings
export const ICON_MAP = new Map();

// Function to map weather codes to their respective icon names
function addMapping(values, icon) {
  // For each value in the provided list, set the corresponding icon in the ICON_MAP
  values.forEach((value) => {
    ICON_MAP.set(value, icon);
  });
}

// Add mappings for different weather codes to corresponding icon names
addMapping([0, 1], "sun"); // Weather codes 0 and 1 map to "sun" icon
addMapping([2], "cloud-sun"); // Weather code 2 maps to "cloud-sun" icon
addMapping([3], "cloud"); // Weather code 3 maps to "cloud" icon
addMapping([45, 48], "smog"); // Weather codes 45 and 48 map to "smog" icon
addMapping(
  [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
  "cloud-showers-heavy" // These weather codes map to "cloud-showers-heavy" icon
);
addMapping([71, 73, 75, 77, 85, 86], "snowflake"); // These weather codes map to "snowflake" icon
addMapping([95, 96, 99], "cloud-bolt"); // Weather codes 95, 96, and 99 map to "cloud-bolt" icon
