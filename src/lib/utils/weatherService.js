/**
 * Weather service using Open-Meteo API
 * No API key required!
 */

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1';

/**
 * Get current weather and forecast by coordinates
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>} Weather data
 */
export async function getWeatherByCoordinates(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh',
      precipitation_unit: 'mm',
      timezone: 'auto',
      forecast_days: 7
    });

    const response = await fetch(`${WEATHER_API_BASE}/forecast?${params}`);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    return formatWeatherData(data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}

/**
 * Search for locations by name
 * @param {string} query - City name or location query
 * @returns {Promise<Array>} Array of location results
 */
export async function searchLocations(query) {
  try {
    const params = new URLSearchParams({
      name: query,
      count: 5,
      language: 'en',
      format: 'json'
    });

    const response = await fetch(`${GEOCODING_API_BASE}/search?${params}`);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
}

/**
 * Get user's current location using browser geolocation
 * @returns {Promise<Object>} Coordinates {latitude, longitude}
 */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  });
}

/**
 * Format raw weather data from Open-Meteo API
 */
function formatWeatherData(data) {
  const current = data.current;
  const daily = data.daily;

  return {
    current: {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      precipitation: current.precipitation,
      weatherCode: current.weather_code,
      condition: getWeatherCondition(current.weather_code),
      icon: getWeatherIcon(current.weather_code)
    },
    daily: daily.time.map((date, index) => ({
      date: date,
      weekday: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      high: Math.round(daily.temperature_2m_max[index]),
      low: Math.round(daily.temperature_2m_min[index]),
      precipitationProbability: daily.precipitation_probability_max[index],
      weatherCode: daily.weather_code[index],
      condition: getWeatherCondition(daily.weather_code[index]),
      icon: getWeatherIcon(daily.weather_code[index])
    }))
  };
}

/**
 * Get weather condition text from WMO weather code
 * https://open-meteo.com/en/docs
 */
function getWeatherCondition(code) {
  const conditions = {
    0: 'Clear',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light Drizzle',
    53: 'Drizzle',
    55: 'Heavy Drizzle',
    61: 'Light Rain',
    63: 'Rain',
    65: 'Heavy Rain',
    71: 'Light Snow',
    73: 'Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers',
    81: 'Showers',
    82: 'Heavy Showers',
    85: 'Light Snow Showers',
    86: 'Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Hail'
  };

  return conditions[code] || 'Unknown';
}

/**
 * Get weather icon emoji from WMO weather code
 */
function getWeatherIcon(code) {
  const icons = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    53: '🌦️',
    55: '🌧️',
    61: '🌧️',
    63: '🌧️',
    65: '⛈️',
    71: '🌨️',
    73: '🌨️',
    75: '❄️',
    77: '🌨️',
    80: '🌦️',
    81: '🌧️',
    82: '⛈️',
    85: '🌨️',
    86: '❄️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️'
  };

  return icons[code] || '🌡️';
}

/**
 * Get weather for a specific date from forecast
 * @param {Array} dailyForecast - Daily forecast array
 * @param {string} targetDate - Date string (YYYY-MM-DD)
 * @returns {Object|null} Weather data for that date
 */
export function getWeatherForDate(dailyForecast, targetDate) {
  if (!dailyForecast || !targetDate) return null;

  const forecast = dailyForecast.find(day => day.date === targetDate);
  return forecast || null;
}
