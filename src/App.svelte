<script>
  import { settings } from './lib/stores/appStore.js';
  import Header from './lib/components/Header.svelte';
  import Sidebar from './lib/components/Sidebar.svelte';
  import TodoList from './lib/components/TodoList.svelte';

  let isMobile = false;
  let activeTab = 'todo'; // 'todo' or 'weather'

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

  function switchSidebarPosition() {
    const newPosition = $settings.sidebarPosition === 'left' ? 'right' : 'left';
    settings.setSidebarPosition(newPosition);
  }
</script>

<div class="app-container">
  <Header
    {isMobile}
    {activeTab}
    on:toggleSidebar={toggleSidebar}
    on:switchSidebarPosition={switchSidebarPosition}
    on:tabChange={(e) => activeTab = e.detail}
  />

  {#if isMobile}
    <!-- Mobile: Tab-based view -->
    <main class="mobile-content">
      {#if activeTab === 'todo'}
        <TodoList />
      {:else}
        <Sidebar />
      {/if}
    </main>
  {:else}
    <!-- Desktop: Sidebar layout -->
    <div class="desktop-layout">
      {#if $settings.sidebarPosition === 'left' && !$settings.sidebarCollapsed}
        <Sidebar position="left" on:toggle={toggleSidebar} />
      {/if}

      <main class="main-content" class:full-width={$settings.sidebarCollapsed}>
        <TodoList />
      </main>

      {#if $settings.sidebarPosition === 'right' && !$settings.sidebarCollapsed}
        <Sidebar position="right" on:toggle={toggleSidebar} />
      {/if}
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
    transition: all 0.3s ease;
    background-color: var(--color-bg-secondary);
  }

  .main-content.full-width {
    max-width: 100%;
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
