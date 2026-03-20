<script>
  import { createEventDispatcher } from 'svelte';
  import { settings } from '../stores/appStore.js';

  export let isMobile = false;
  export let activeTab = 'todo';

  const dispatch = createEventDispatcher();

  let showSettings = false;

  function toggleSettings() {
    showSettings = !showSettings;
  }

  function handleTabChange(tab) {
    dispatch('tabChange', tab);
  }
</script>

<header class="header">
  <div class="header-content">
    <!-- Left section -->
    <div class="header-left">
      {#if !isMobile}
        <button
          class="icon-button"
          on:click={() => dispatch('toggleSidebar')}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      {/if}
      <h1 class="app-title">TaskWeather</h1>
    </div>

    <!-- Center section - Mobile tabs -->
    {#if isMobile}
      <div class="mobile-tabs">
        <button
          class="tab"
          class:active={activeTab === 'todo'}
          on:click={() => handleTabChange('todo')}
        >
          To-Do
        </button>
        <button
          class="tab"
          class:active={activeTab === 'weather'}
          on:click={() => handleTabChange('weather')}
        >
          Weather
        </button>
      </div>
    {/if}

    <!-- Right section -->
    <div class="header-right">
      {#if !isMobile}
        <div class="settings-container">
          <button
            class="icon-button"
            on:click={toggleSettings}
            aria-label="Settings"
            title="Settings"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m-5-13L9 9m6 6l2 3M1 12h6m6 0h6m-13-5l3 2m6 6l3 2M7 20l2-3m6-6l2-3"></path>
            </svg>
          </button>

          {#if showSettings}
            <div class="settings-menu">
              <div class="menu-header">Sidebar Position</div>
              <button
                class="menu-item"
                on:click={() => {
                  dispatch('switchSidebarPosition');
                  showSettings = false;
                }}
              >
                <span>Switch to {$settings.sidebarPosition === 'left' ? 'Right' : 'Left'}</span>
              </button>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</header>

<style>
  .header {
    height: 64px;
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    height: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-left,
  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .app-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
  }

  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    border-radius: 8px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .icon-button:hover {
    background-color: var(--color-bg-secondary);
    color: var(--color-text);
  }

  .mobile-tabs {
    display: flex;
    gap: 0.5rem;
    background-color: var(--color-bg-secondary);
    padding: 4px;
    border-radius: 8px;
  }

  .tab {
    padding: 0.5rem 1.25rem;
    border: none;
    background: transparent;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tab.active {
    background-color: var(--color-bg);
    color: var(--color-text);
    box-shadow: var(--shadow-sm);
  }

  .settings-container {
    position: relative;
  }

  .settings-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 200px;
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    z-index: 1000;
  }

  .menu-header {
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    background-color: var(--color-bg-secondary);
  }

  .menu-item {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    text-align: left;
    font-size: 0.875rem;
    color: var(--color-text);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .menu-item:hover {
    background-color: var(--color-bg-secondary);
  }

  @media (max-width: 768px) {
    .header {
      height: 56px;
    }

    .header-content {
      padding: 0 1rem;
    }

    .app-title {
      font-size: 1.25rem;
    }
  }
</style>
