<script>
  import { createEventDispatcher } from 'svelte';

  export let task;

  const dispatch = createEventDispatcher();

  const priorityColors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444'
  };

  const categoryColors = {
    Personal: '#3b82f6',
    Work: '#8b5cf6',
    Shopping: '#ec4899',
    Health: '#10b981',
    Other: '#6b7280'
  };

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
    dispatch('toggle', { id: task.id });
  }

  function handleEdit() {
    dispatch('edit', task);
  }

  function handleDelete() {
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch('delete', { id: task.id });
    }
  }
</script>

<div class="task-card" class:completed={task.completed}>
  <div class="task-main">
    <!-- Checkbox -->
    <button
      class="checkbox"
      class:checked={task.completed}
      on:click={handleToggle}
      aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {#if task.completed}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      {/if}
    </button>

    <!-- Task Info -->
    <div class="task-info">
      <div class="task-header">
        <h3 class="task-title" class:completed-text={task.completed}>{task.title}</h3>
        <div class="task-badges">
          <span
            class="category-badge"
            style="background-color: {categoryColors[task.category]}20; color: {categoryColors[task.category]}"
          >
            {task.category}
          </span>
          <span
            class="priority-badge"
            style="background-color: {priorityColors[task.priority]}20; color: {priorityColors[task.priority]}"
          >
            {task.priority}
          </span>
        </div>
      </div>

      {#if task.dueDate}
        <div class="task-meta">
          <span class="due-date" class:overdue={isOverdue(task.dueDate) && !task.completed}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {formatDate(task.dueDate)}
          </span>
          {#if task.recurring}
            <span class="recurring-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              {task.recurring}
            </span>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Actions -->
  <div class="task-actions">
    <button class="action-btn" on:click={handleEdit} aria-label="Edit task" title="Edit">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    </button>
    <button class="action-btn delete-btn" on:click={handleDelete} aria-label="Delete task" title="Delete">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>
  </div>
</div>

<style>
  .task-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    transition: all 0.2s ease;
    gap: 1rem;
  }

  .task-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .task-card.completed {
    opacity: 0.7;
  }

  .task-main {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    flex: 1;
    min-width: 0;
  }

  .checkbox {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border: 2px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .checkbox:hover {
    border-color: var(--color-primary);
  }

  .checkbox.checked {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  }

  .task-info {
    flex: 1;
    min-width: 0;
  }

  .task-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .task-title {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    color: var(--color-text);
    word-break: break-word;
  }

  .task-title.completed-text {
    text-decoration: line-through;
    color: var(--color-text-secondary);
  }

  .task-badges {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .category-badge,
  .priority-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .task-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .due-date,
  .recurring-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .due-date.overdue {
    color: var(--color-danger);
    font-weight: 500;
  }

  .task-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: 6px;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    background-color: var(--color-bg-secondary);
    color: var(--color-text);
  }

  .delete-btn:hover {
    background-color: rgba(239, 68, 68, 0.1);
    color: var(--color-danger);
  }

  @media (max-width: 768px) {
    .task-card {
      padding: 1rem;
    }

    .task-header {
      flex-direction: column;
      gap: 0.5rem;
    }

    .task-badges {
      align-self: flex-start;
    }

    .task-actions {
      flex-direction: column;
    }
  }
</style>
