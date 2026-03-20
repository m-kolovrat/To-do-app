import { writable, derived } from 'svelte/store';
import { getWeatherByCoordinates, searchLocations, getCurrentPosition } from '../utils/weatherService.js';

// Weather data store
function createWeatherStore() {
  const { subscribe, set, update } = writable({
    current: null,
    daily: null,
    location: null,
    loading: false,
    error: null,
    lastUpdated: null
  });

  return {
    subscribe,

    /**
     * Fetch weather by coordinates
     */
    async fetchWeather(latitude, longitude, locationName = null) {
      update(state => ({ ...state, loading: true, error: null }));

      try {
        const weatherData = await getWeatherByCoordinates(latitude, longitude);

        update(state => ({
          ...state,
          current: weatherData.current,
          daily: weatherData.daily,
          location: locationName ? {
            name: locationName,
            latitude,
            longitude
          } : state.location,
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString()
        }));

        return weatherData;
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: error.message || 'Failed to fetch weather data'
        }));
        throw error;
      }
    },

    /**
     * Fetch weather using browser geolocation
     */
    async fetchWeatherByCurrentLocation() {
      update(state => ({ ...state, loading: true, error: null }));

      try {
        const coords = await getCurrentPosition();
        await this.fetchWeather(coords.latitude, coords.longitude, 'Current Location');
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: 'Unable to get your location. Please search manually.'
        }));
        // Fallback to a default location (e.g., New York)
        await this.fetchWeather(40.7128, -74.0060, 'New York, NY');
      }
    },

    /**
     * Refresh weather data
     */
    async refresh() {
      const currentState = await new Promise(resolve => {
        const unsubscribe = subscribe(state => {
          resolve(state);
          unsubscribe();
        });
      });

      if (currentState.location) {
        await this.fetchWeather(
          currentState.location.latitude,
          currentState.location.longitude,
          currentState.location.name
        );
      }
    },

    /**
     * Clear error
     */
    clearError() {
      update(state => ({ ...state, error: null }));
    },

    /**
     * Reset store
     */
    reset() {
      set({
        current: null,
        daily: null,
        location: null,
        loading: false,
        error: null,
        lastUpdated: null
      });
    }
  };
}

// Location search store
function createLocationSearchStore() {
  const { subscribe, set, update } = writable({
    results: [],
    loading: false,
    error: null,
    query: ''
  });

  return {
    subscribe,

    /**
     * Search for locations
     */
    async search(query) {
      if (!query || query.trim().length < 2) {
        set({ results: [], loading: false, error: null, query: '' });
        return;
      }

      update(state => ({ ...state, loading: true, error: null, query }));

      try {
        const results = await searchLocations(query);

        update(state => ({
          ...state,
          results: results || [],
          loading: false,
          error: results?.length === 0 ? 'No locations found' : null
        }));
      } catch (error) {
        update(state => ({
          ...state,
          results: [],
          loading: false,
          error: error.message || 'Failed to search locations'
        }));
      }
    },

    /**
     * Clear search results
     */
    clear() {
      set({ results: [], loading: false, error: null, query: '' });
    }
  };
}

// Export stores
export const weather = createWeatherStore();
export const locationSearch = createLocationSearchStore();

// Derived store for checking if weather data is stale (older than 30 minutes)
export const isWeatherStale = derived(
  weather,
  $weather => {
    if (!$weather.lastUpdated) return true;

    const lastUpdate = new Date($weather.lastUpdated);
    const now = new Date();
    const diffMinutes = (now - lastUpdate) / 1000 / 60;

    return diffMinutes > 30;
  }
);
