<script>
  import { createEventDispatcher } from 'svelte';

  export let note;

  const dispatch = createEventDispatcher();

  const priorityColors = {
    low: '#4CD964',
    medium: '#D4E842',
    high: '#FF6347'
  };

  const categoryColors = {
    Personal: '#4DB8FF',
    Work: '#D4E842',
    Shopping: '#FF6347',
    Health: '#4CD964',
    Other: '#6C6C70'
  };

  const cardBackgrounds = {
    Personal: '#C8E6F5',
    Work: '#F5F7D4',
    Shopping: '#FFD4CC',
    Health: '#D4F5DB',
    Other: '#E0E0E2'
  };

  function getYear() {
    return new Date(note.createdAt).getFullYear();
  }

  function getContentPreview() {
    if (!note.content) return '';
    // Get first 100 characters, truncate at word boundary
    const preview = note.content.substring(0, 100);
    const lastSpace = preview.lastIndexOf(' ');
    return lastSpace > 0 ? preview.substring(0, lastSpace) + '...' : preview + '...';
  }

  function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }

  function isOverdue(dateString) {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  }

  function handleToggle() {
    dispatch('toggle', { id: note.id });
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

<div class="note-card" class:completed={note.completed} style="background-color: {cardBackgrounds[note.category]}">
  <!-- Card Header: Year + Category -->
  <div class="card-header">
    <span class="card-year">{getYear()}</span>
    <span class="card-category">{note.category}</span>
  </div>

  <!-- Card Title -->
  <h3 class="card-title" class:completed-text={note.completed}>{note.name}</h3>

  <!-- Content Preview -->
  {#if note.content}
    <p class="card-content-preview">{getContentPreview()}</p>
  {/if}

  <!-- Card Metadata -->
  <div class="card-meta">
    {#if note.priority}
      <span
        class="priority-badge"
        style="background-color: {priorityColors[note.priority]}40; color: {priorityColors[note.priority]}"
      >
        {note.priority}
      </span>
    {/if}

    {#if note.dueDate}
      <span class="due-date" class:overdue={isOverdue(note.dueDate) && !note.completed}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        {formatDate(note.dueDate)}
      </span>
    {/if}

    {#if note.recurring}
      <span class="recurring-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        {note.recurring}
      </span>
    {/if}
  </div>

  <!-- Card Footer: Checkbox + Actions -->
  <div class="card-footer">
    <button
      class="checkbox"
      class:checked={note.completed}
      on:click={handleToggle}
      aria-label={note.completed ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {#if note.completed}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      {/if}
    </button>

    <div class="card-actions">
      <button class="action-btn" on:click={handleEdit} aria-label="Edit note" title="Edit">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button class="action-btn delete-btn" on:click={handleDelete} aria-label="Delete note" title="Delete">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  </div>
</div>

<style>
  .note-card {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    border-radius: 16px;
    transition: all 0.25s ease;
    cursor: pointer;
    min-height: 200px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .note-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .note-card.completed {
    opacity: 0.65;
  }

  /* Card Header */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.813rem;
    color: #5A5A5C;
  }

  .card-year {
    font-weight: 600;
  }

  .card-category {
    font-weight: 500;
    text-transform: capitalize;
  }

  /* Card Title */
  .card-title {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.4;
    margin: 0 0 1rem 0;
    color: #1A1A1C;
    word-wrap: break-word;
    flex-grow: 1;
  }

  .card-title.completed-text {
    text-decoration: line-through;
    color: #5A5A5C;
  }

  /* Content Preview */
  .card-content-preview {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #5A5A5C;
    margin: 0 0 0.75rem 0;
    word-wrap: break-word;
  }

  /* Card Metadata */
  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    min-height: 24px;
  }

  .priority-badge {
    padding: 0.25rem 0.625rem;
    border-radius: 6px;
    font-size: 0.688rem;
    font-weight: 600;
    text-transform: capitalize;
    letter-spacing: 0.02em;
  }

  .due-date,
  .recurring-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: #5A5A5C;
    font-weight: 500;
  }

  .due-date.overdue {
    color: #FF3B30;
    font-weight: 600;
  }

  /* Card Footer */
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }

  .checkbox {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border: 2px solid #8E8E93;
    border-radius: 6px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .checkbox:hover {
    border-color: #1A1A1C;
    background-color: rgba(0, 0, 0, 0.05);
  }

  .checkbox.checked {
    background-color: #1A1A1C;
    border-color: #1A1A1C;
    color: white;
  }

  .card-actions {
    display: flex;
    gap: 0.25rem;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 6px;
    color: #5A5A5C;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    background-color: rgba(0, 0, 0, 0.08);
    color: #1A1A1C;
  }

  .delete-btn:hover {
    background-color: rgba(255, 59, 48, 0.1);
    color: #FF3B30;
  }

  @media (max-width: 768px) {
    .note-card {
      padding: 1.25rem;
      min-height: 180px;
    }

    .card-title {
      font-size: 1.125rem;
    }
  }
</style>
