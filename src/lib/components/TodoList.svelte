<script>
  import { tasks, uiState, settings } from '../stores/appStore.js';
  import TaskCard from './TaskCard.svelte';
  import TaskModal from './TaskModal.svelte';

  let filterCategory = null;
  let sortBy = 'created';

  const categories = ['Personal', 'Work', 'Shopping', 'Health', 'Other'];
  const priorities = ['low', 'medium', 'high'];

  $: filteredTasks = $tasks
    .filter(task => !filterCategory || task.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  $: incompleteTasks = filteredTasks.filter(task => !task.completed);
  $: completedTasks = filteredTasks.filter(task => task.completed);

  function openTaskModal() {
    uiState.update(state => ({ ...state, taskModalOpen: true, selectedTask: null }));
  }

  function closeTaskModal() {
    uiState.update(state => ({ ...state, taskModalOpen: false, selectedTask: null }));
  }

  function handleEditTask(event) {
    uiState.update(state => ({ ...state, taskModalOpen: true, selectedTask: event.detail }));
  }

  function handleDeleteTask(event) {
    tasks.delete(event.detail.id);
  }

  function handleToggleTask(event) {
    tasks.toggle(event.detail.id);
  }
</script>

<div class="todo-container">
  <!-- Toolbar -->
  <div class="toolbar">
    <div class="toolbar-left">
      <h2 class="section-title">My Tasks</h2>
      <span class="task-count">{incompleteTasks.length} active</span>
    </div>
    <button class="add-button" on:click={openTaskModal}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Add Task
    </button>
  </div>

  <!-- Filters and Sort -->
  <div class="controls">
    <div class="filters">
      <button
        class="filter-chip"
        class:active={filterCategory === null}
        on:click={() => filterCategory = null}
      >
        All
      </button>
      {#each categories as category}
        <button
          class="filter-chip"
          class:active={filterCategory === category}
          on:click={() => filterCategory = category}
        >
          {category}
        </button>
      {/each}
    </div>

    <div class="sort-select-wrapper">
      <label for="sort-select" class="sort-label">Sort by:</label>
      <select id="sort-select" class="sort-select" bind:value={sortBy}>
        <option value="created">Date Created</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  </div>

  <!-- Task List -->
  <div class="task-list">
    {#if incompleteTasks.length === 0 && completedTasks.length === 0}
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No tasks yet</h3>
        <p>Add your first task to get started!</p>
      </div>
    {:else}
      <!-- Incomplete Tasks -->
      {#if incompleteTasks.length > 0}
        <div class="task-section">
          {#each incompleteTasks as task (task.id)}
            <TaskCard
              {task}
              on:edit={handleEditTask}
              on:delete={handleDeleteTask}
              on:toggle={handleToggleTask}
            />
          {/each}
        </div>
      {/if}

      <!-- Completed Tasks -->
      {#if completedTasks.length > 0}
        <div class="task-section completed-section">
          <h3 class="section-subtitle">Completed ({completedTasks.length})</h3>
          {#each completedTasks as task (task.id)}
            <TaskCard
              {task}
              on:edit={handleEditTask}
              on:delete={handleDeleteTask}
              on:toggle={handleToggleTask}
            />
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>

<!-- Task Modal -->
{#if $uiState.taskModalOpen}
  <TaskModal
    task={$uiState.selectedTask}
    on:close={closeTaskModal}
  />
{/if}

<style>
  .todo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .section-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: var(--color-text);
    letter-spacing: -0.02em;
  }

  .task-count {
    padding: 0.2rem 0.65rem;
    background-color: var(--color-bg-tertiary);
    border-radius: 999px;
    font-size: 0.813rem;
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  .add-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background-color: #FFFFFF;
    color: #1A1A1C;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .add-button:hover {
    background-color: #E5E5E5;
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .filter-chip {
    padding: 0.4rem 0.875rem;
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 999px;
    font-size: 0.813rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-chip:hover {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text);
    border-color: #3A3A3C;
  }

  .filter-chip.active {
    background-color: var(--color-bg-tertiary);
    border-color: #3A3A3C;
    color: var(--color-text);
  }

  .sort-select-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sort-label {
    font-size: 0.813rem;
    color: var(--color-text-muted);
  }

  .sort-select {
    padding: 0.4rem 0.875rem;
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 0.813rem;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .sort-select:hover {
    border-color: #3A3A3C;
    color: var(--color-text);
  }

  .sort-select:focus {
    outline: none;
    border-color: #3A3A3C;
    box-shadow: none;
  }

  .task-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .task-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .completed-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
  }

  .section-subtitle {
    font-size: 0.688rem;
    font-weight: 500;
    color: var(--color-text-muted);
    margin: 0 0 1rem 0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 0.5rem 0;
  }

  .empty-state p {
    font-size: 1rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  @media (max-width: 768px) {
    .todo-container {
      padding: 1rem;
    }

    .toolbar {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .toolbar-left {
      justify-content: space-between;
    }

    .section-title {
      font-size: 1.5rem;
    }

    .add-button {
      width: 100%;
      justify-content: center;
    }

    .controls {
      flex-direction: column;
      align-items: stretch;
    }

    .sort-select-wrapper {
      justify-content: space-between;
    }
  }
</style>
