<script>
  import { createEventDispatcher } from 'svelte';
  import { categories } from '../stores/appStore.js';

  export let note;

  const dispatch = createEventDispatcher();

  let hovered = false;

  $: categoryColor = (() => {
    const cat = $categories.find(c => c.name === note.category);
    return cat ? cat.color : '#6C6C70';
  })();

  function getContentPreview() {
    if (!note.content) return '';
    const preview = note.content.substring(0, 100);
    const lastSpace = preview.lastIndexOf(' ');
    return lastSpace > 0 ? preview.substring(0, lastSpace) + '...' : preview + '...';
  }

  function handleEdit() {
    dispatch('edit', note);
  }

  function handleDelete() {
    if (confirm('Are you sure you want to delete this note?')) {
      dispatch('delete', { id: note.id });
    }
  }
</script>

<div
  class="note-card"
  class:completed={note.completed}
  on:mouseenter={() => hovered = true}
  on:mouseleave={() => hovered = false}
>
  <div class="card-row">
    <span class="category-dot" style="background-color: {categoryColor}"></span>
    <div class="card-content">
      <h3 class="card-title" class:completed-text={note.completed}>{note.name}</h3>
      {#if note.content}
        <p class="card-text">{getContentPreview()}</p>
      {/if}
    </div>
    {#if hovered}
      <div class="card-actions">
        <button class="action-btn" on:click|stopPropagation={handleEdit} aria-label="Edit note" title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="action-btn delete" on:click|stopPropagation={handleDelete} aria-label="Delete note" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .note-card {
    padding: 16px 0;
    transition: all 0.15s ease;
    cursor: pointer;
  }

  .note-card.completed {
    opacity: 0.5;
  }

  .card-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .category-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 7px;
  }

  .card-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .card-title {
    font-family: 'Geist', sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    margin: 0;
    color: var(--color-text);
    word-wrap: break-word;
  }

  .card-title.completed-text {
    text-decoration: line-through;
    color: var(--color-text-muted);
  }

  .card-text {
    font-family: 'Geist', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: var(--color-text-secondary);
    margin: 0;
    word-wrap: break-word;
  }

  .card-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 4px;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
    padding: 0;
  }

  .action-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--color-text);
  }

  .action-btn.delete:hover {
    background-color: rgba(255, 99, 71, 0.15);
    color: #FF6347;
  }
</style>
