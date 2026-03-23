<script>
  import { notes, uiState } from '../stores/appStore.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const categories = [
    { name: 'Economics', color: '#9b59b6' },
    { name: 'Psychology', color: '#D4AF37' },
    { name: 'Computer Science', color: '#3498db' },
    { name: 'Knowledge graphs', color: '#e74c3c' },
    { name: 'Machine learning', color: '#8B4513' },
    { name: 'Cyber security', color: '#16a085' },
    { name: 'AI', color: '#9ACD32' },
    { name: 'LLMs', color: '#FF8C00' },
    { name: 'Bioinformatics', color: '#CD853F' },
    { name: 'Biotech', color: '#9ACD32' },
    { name: 'Virtual cells', color: '#9B9FD8' },
    { name: 'Biology', color: '#2E8B57' },
    { name: 'Physics', color: '#5B4A99' },
    { name: 'Creativity', color: '#6B3629' },
    { name: 'Hardware', color: '#9B9FD8' },
    { name: 'Probability', color: '#BC8F8F' },
    { name: 'Ecology', color: '#48C9B0' },
    { name: 'Cognition', color: '#8B7355' },
    { name: 'Nutrition', color: '#7CFC00' },
    { name: 'History', color: '#704214' },
    { name: 'Meta', color: '#4169E1' },
    { name: 'Classics', color: '#8B7355' },
    { name: 'Webpages', color: '#483D8B' },
    { name: 'Statistics', color: '#FF8C00' },
    { name: 'Astronomy', color: '#9B9FD8' },
    { name: 'Crypto', color: '#FF1493' },
    { name: 'Sociology', color: '#D3D3A3' }
  ];

  // Count notes per category
  $: categoryCounts = categories.reduce((acc, cat) => {
    acc[cat.name] = $notes.filter(note => note.category === cat.name).length;
    return acc;
  }, {});

  $: totalNotes = $notes.length;

  function selectCategory(categoryName) {
    uiState.update(state => ({ ...state, filterCategory: categoryName }));
  }

  function selectAll() {
    uiState.update(state => ({ ...state, filterCategory: null }));
  }
</script>

<aside class="category-sidebar">
  <div class="sidebar-header">
    <h2 class="sidebar-title">My library</h2>
  </div>

  <div class="category-list">
    <!-- All Notes -->
    <button
      class="category-item"
      class:active={$uiState.filterCategory === null}
      on:click={selectAll}
    >
      <span class="category-dot" style="background-color: #999"></span>
      <span class="category-name">All Notes</span>
      <span class="category-count">{totalNotes}</span>
    </button>

    <!-- Individual Categories -->
    {#each categories as category}
      {#if categoryCounts[category.name] > 0}
        <button
          class="category-item"
          class:active={$uiState.filterCategory === category.name}
          on:click={() => selectCategory(category.name)}
        >
          <span class="category-dot" style="background-color: {category.color}"></span>
          <span class="category-name">{category.name}</span>
          <span class="category-count">{categoryCounts[category.name]}</span>
        </button>
      {/if}
    {/each}
  </div>
</aside>

<style>
  .category-sidebar {
    width: 280px;
    height: 100%;
    background-color: var(--color-bg-secondary);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .sidebar-header {
    padding: 1.5rem 1.25rem 1rem 1.25rem;
    border-bottom: 1px solid var(--color-border);
  }

  .sidebar-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
  }

  .category-list {
    padding: 1rem 0.75rem;
    flex: 1;
    overflow-y: auto;
  }

  .category-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.75rem;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.15s ease;
    text-align: left;
    margin-bottom: 0.25rem;
  }

  .category-item:hover {
    background-color: var(--color-bg-tertiary);
  }

  .category-item.active {
    background-color: var(--color-bg-tertiary);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .category-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .category-name {
    flex: 1;
    font-size: 0.875rem;
    color: var(--color-text);
    font-weight: 400;
  }

  .category-item.active .category-name {
    font-weight: 500;
  }

  .category-count {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    font-weight: 400;
  }

  /* Custom scrollbar */
  .category-sidebar::-webkit-scrollbar {
    width: 6px;
  }

  .category-sidebar::-webkit-scrollbar-track {
    background: transparent;
  }

  .category-sidebar::-webkit-scrollbar-thumb {
    background: var(--color-bg-tertiary);
    border-radius: 3px;
  }

  .category-sidebar::-webkit-scrollbar-thumb:hover {
    background: #3A3A3C;
  }
</style>
