<script>
  import { createEventDispatcher } from 'svelte';

  export let isMobile = false;
  export let activeTab = 'notes';

  const dispatch = createEventDispatcher();

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
          aria-label="Toggle category sidebar"
          title="Toggle category sidebar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      {/if}
      <h1 class="app-title">Notes</h1>
    </div>

    <!-- Center section - Mobile tabs -->
    {#if isMobile}
      <div class="mobile-tabs">
        <button
          class="tab"
          class:active={activeTab === 'notes'}
          on:click={() => handleTabChange('notes')}
        >
          Notes
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
      <!-- Settings removed -->
    </div>
  </div>
</header>

<style>
  .header {
    height: 64px;
    background-color: var(--color-bg-secondary);
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
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
    letter-spacing: -0.01em;
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
    background-color: var(--color-bg-tertiary);
    color: var(--color-text);
  }

  .mobile-tabs {
    display: flex;
    gap: 0.5rem;
    background-color: var(--color-bg-tertiary);
    padding: 4px;
    border-radius: 8px;
  }

  .tab {
    padding: 0.4rem 1.25rem;
    border: none;
    background: transparent;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .tab.active {
    background-color: var(--color-bg-secondary);
    color: var(--color-text);
    box-shadow: var(--shadow-sm);
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
