<script>
  import { settings } from './lib/stores/appStore.js';
  import Header from './lib/components/Header.svelte';
  import CategorySidebar from './lib/components/CategorySidebar.svelte';
  import Sidebar from './lib/components/Sidebar.svelte';
  import NotesList from './lib/components/NotesList.svelte';

  let isMobile = false;
  let activeTab = 'notes'; // 'notes' or 'weather'

  // Check if mobile
  function checkMobile() {
    isMobile = window.innerWidth < 768;
  }

  // Run on mount and window resize
  $: if (typeof window !== 'undefined') {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  }

  function toggleSidebar() {
    settings.setSidebarCollapsed(!$settings.sidebarCollapsed);
  }
</script>

<div class="app-container">
  <Header
    {isMobile}
    {activeTab}
    on:toggleSidebar={toggleSidebar}
    on:tabChange={(e) => activeTab = e.detail}
  />

  {#if isMobile}
    <!-- Mobile: Tab-based view -->
    <main class="mobile-content">
      {#if activeTab === 'notes'}
        <NotesList />
      {:else}
        <Sidebar />
      {/if}
    </main>
  {:else}
    <!-- Desktop: Category sidebar (left, collapsible) + Notes (center) + Weather (right, always visible) -->
    <div class="desktop-layout">
      {#if !$settings.sidebarCollapsed}
        <CategorySidebar />
      {/if}

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
    overflow: hidden;
    height: calc(100vh - 64px); /* Header height */
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

  @media (max-width: 768px) {
    .desktop-layout {
      height: calc(100vh - 56px); /* Smaller header on mobile */
    }
  }
</style>
