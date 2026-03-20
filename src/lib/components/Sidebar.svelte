<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { settings } from '../stores/appStore.js';
  import { weather, locationSearch } from '../stores/weatherStore.js';

  export let position = 'right';

  const dispatch = createEventDispatcher();

  let showLocationSearch = false;
  let searchQuery = '';
  let searchTimeout;

  // Fetch weather on mount
  onMount(async () => {
    if (!$weather.current) {
      await weather.fetchWeatherByCurrentLocation();
    }
  });

  function handleCollapse() {
    dispatch('toggle');
  }

  function toggleLocationSearch() {
    showLocationSearch = !showLocationSearch;
    if (!showLocationSearch) {
      locationSearch.clear();
      searchQuery = '';
    }
  }

  function handleSearchInput(event) {
    searchQuery = event.target.value;

    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        locationSearch.search(searchQuery);
      } else {
        locationSearch.clear();
      }
    }, 300);
  }

  async function selectLocation(location) {
    await weather.fetchWeather(
      location.latitude,
      location.longitude,
      `${location.name}${location.admin1 ? ', ' + location.admin1 : ''}${location.country ? ', ' + location.country : ''}`
    );
    toggleLocationSearch();
  }

  async function useCurrentLocation() {
    await weather.fetchWeatherByCurrentLocation();
    toggleLocationSearch();
  }
</script>

<aside class="sidebar" class:left={position === 'left'} class:right={position === 'right'}>
  <div class="sidebar-header">
    <h2 class="sidebar-title">Weather</h2>
    <button
      class="collapse-btn"
      on:click={handleCollapse}
      aria-label="Collapse sidebar"
      title="Collapse sidebar"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        {#if position === 'left'}
          <polyline points="15 18 9 12 15 6"></polyline>
        {:else}
          <polyline points="9 18 15 12 9 6"></polyline>
        {/if}
      </svg>
    </button>
  </div>

  <div class="sidebar-content">
    <!-- Location Search -->
    <div class="location-section">
      {#if !showLocationSearch}
        <button class="location-btn" on:click={toggleLocationSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{$weather.location?.name || 'Loading...'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      {:else}
        <div class="search-container">
          <input
            type="text"
            class="search-input"
            placeholder="Search for a city..."
            value={searchQuery}
            on:input={handleSearchInput}
            autofocus
          />
          <button class="close-search-btn" on:click={toggleLocationSearch}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {#if $locationSearch.loading}
          <div class="search-status">Searching...</div>
        {:else if $locationSearch.error}
          <div class="search-status error">{$locationSearch.error}</div>
        {:else if $locationSearch.results.length > 0}
          <div class="search-results">
            <button class="search-result-item" on:click={useCurrentLocation}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="16 12 12 8 8 12"></polyline>
                <line x1="12" y1="16" x2="12" y2="8"></line>
              </svg>
              Use Current Location
            </button>
            {#each $locationSearch.results as location}
              <button class="search-result-item" on:click={() => selectLocation(location)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {location.name}{location.admin1 ? ', ' + location.admin1 : ''}{location.country ? ', ' + location.country : ''}
              </button>
            {/each}
          </div>
        {/if}
      {/if}
    </div>

    {#if $weather.loading}
      <!-- Loading State -->
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading weather data...</p>
      </div>
    {:else if $weather.error}
      <!-- Error State -->
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <p>{$weather.error}</p>
        <button class="retry-btn" on:click={() => weather.fetchWeatherByCurrentLocation()}>
          Try Again
        </button>
      </div>
    {:else if $weather.current}
      <!-- Current Weather -->
      <div class="current-weather">
        <div class="location-name">{$weather.location?.name || 'Unknown Location'}</div>
        <div class="weather-icon">{$weather.current.icon}</div>
        <div class="weather-temp">{$weather.current.temperature}°C</div>
        <div class="weather-condition">{$weather.current.condition}</div>
      </div>

      <!-- Forecast -->
      {#if $weather.daily && $weather.daily.length > 0}
        <div class="forecast-section">
          <h3 class="forecast-title">7-Day Forecast</h3>
          <div class="forecast-list">
            {#each $weather.daily.slice(0, 7) as day}
              <div class="forecast-item">
                <span class="forecast-day">{day.weekday}</span>
                <span class="forecast-icon">{day.icon}</span>
                <div class="forecast-temps">
                  <span class="forecast-high">{day.high}°</span>
                  <span class="forecast-low">{day.low}°</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Weather Details -->
      <div class="weather-details">
        <div class="detail-item">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">{$weather.current.humidity}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wind</span>
          <span class="detail-value">{$weather.current.windSpeed} km/h</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Feels Like</span>
          <span class="detail-value">{$weather.current.feelsLike}°C</span>
        </div>
      </div>
    {/if}
  </div>
</aside>

<style>
  .sidebar {
    width: var(--sidebar-width);
    height: 100%;
    background-color: var(--color-bg);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar.right {
    border-right: none;
    border-left: 1px solid var(--color-border);
  }

  .sidebar-header {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-border);
  }

  .sidebar-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
  }

  .collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 6px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .collapse-btn:hover {
    background-color: var(--color-bg-secondary);
    color: var(--color-text);
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }

  .location-section {
    margin-bottom: 2rem;
  }

  .location-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .location-btn:hover {
    background-color: var(--color-bg-tertiary);
  }

  .location-btn span {
    flex: 1;
    text-align: left;
  }

  .current-weather {
    text-align: center;
    padding: 2rem 0;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 1.5rem;
  }

  .location-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 1rem;
  }

  .weather-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .weather-temp {
    font-size: 3rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 0.5rem;
  }

  .weather-condition {
    font-size: 1rem;
    color: var(--color-text-secondary);
  }

  .forecast-section {
    margin-bottom: 1.5rem;
  }

  .forecast-title {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin: 0 0 1rem 0;
  }

  .forecast-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .forecast-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background-color: var(--color-bg-secondary);
    border-radius: 8px;
  }

  .forecast-day {
    width: 40px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .forecast-icon {
    font-size: 1.5rem;
    margin: 0 1rem;
  }

  .forecast-temps {
    margin-left: auto;
    display: flex;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .forecast-high {
    font-weight: 600;
    color: var(--color-text);
  }

  .forecast-low {
    color: var(--color-text-secondary);
  }

  .weather-details {
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-label {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .detail-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .search-container {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--color-text);
    transition: all 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .close-search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background-color: var(--color-bg-secondary);
    border-radius: 8px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-search-btn:hover {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text);
  }

  .search-status {
    padding: 1rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .search-status.error {
    color: var(--color-danger);
  }

  .search-results {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
  }

  .search-result-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background-color: var(--color-bg-secondary);
    border: 1px solid transparent;
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--color-text);
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .search-result-item:hover {
    background-color: var(--color-bg-tertiary);
    border-color: var(--color-primary);
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .loading-state p,
  .error-state p {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .retry-btn {
    margin-top: 1rem;
    padding: 0.5rem 1.25rem;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .retry-btn:hover {
    background-color: var(--color-primary-dark);
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      height: auto;
      border: none;
    }

    .sidebar-header {
      display: none;
    }
  }
</style>
