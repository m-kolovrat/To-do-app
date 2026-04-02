<script>
  import CategorySidebar from './lib/components/CategorySidebar.svelte';
  import Sidebar from './lib/components/Sidebar.svelte';
  import NotesList from './lib/components/NotesList.svelte';

  let isMobile = false;
  let activeTab = 'notes'; // 'notes' or 'weather'

  function checkMobile() {
    isMobile = window.innerWidth < 768;
  }

  $: if (typeof window !== 'undefined') {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  }
</script>

<div class="app-container">
  {#if isMobile}
    <!-- Mobile: Tab-based view -->
    <div class="mobile-tabs">
      <button
        class="tab"
        class:active={activeTab === 'notes'}
        on:click={() => activeTab = 'notes'}
      >
        Notes
      </button>
      <button
        class="tab"
        class:active={activeTab === 'weather'}
        on:click={() => activeTab = 'weather'}
      >
        Weather
      </button>
    </div>
    <main class="mobile-content">
      {#if activeTab === 'notes'}
        <NotesList />
      {:else}
        <Sidebar />
      {/if}
    </main>
  {:else}
    <!-- Desktop: Category sidebar (left) + Notes (center) + Weather (right) -->
    <div class="desktop-layout">
      <CategorySidebar />

      <main class="main-content">
        <NotesList />
      </main>

      <Sidebar position="right" />
    </div>
  {/if}
</div>

<style>
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg);
  }

  .desktop-layout {
    display: flex;
    flex: 1;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    background-color: var(--color-bg-secondary);
  }

  .mobile-content {
    flex: 1;
    overflow-y: auto;
    background-color: var(--color-bg-secondary);
  }

  .mobile-tabs {
    display: flex;
    gap: 0.5rem;
    background-color: var(--color-bg-secondary);
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border);
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
    background-color: var(--color-bg-tertiary);
    color: var(--color-text);
    box-shadow: var(--shadow-sm);
  }
</style>
