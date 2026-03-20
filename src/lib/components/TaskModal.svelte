<script>
  import { createEventDispatcher } from 'svelte';
  import { tasks } from '../stores/appStore.js';
  import { weather } from '../stores/weatherStore.js';
  import { getWeatherForDate } from '../utils/weatherService.js';
  import { animate } from 'motion';

  export let task = null;

  const dispatch = createEventDispatcher();

  const categories = ['Personal', 'Work', 'Shopping', 'Health', 'Other'];
  const priorities = ['low', 'medium', 'high'];
  const recurringOptions = [
    { value: null, label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  let formData = {
    title: task?.title || '',
    category: task?.category || 'Personal',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate || '',
    recurring: task?.recurring || null
  };

  let modalElement;

  // Get weather for the due date
  $: dateWeather = formData.dueDate && $weather.daily
    ? getWeatherForDate($weather.daily, formData.dueDate)
    : null;

  // Animate modal in
  $: if (modalElement) {
    animate(modalElement, { opacity: [0, 1], scale: [0.95, 1] }, { duration: 0.2 });
  }

  function handleSubmit() {
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (task) {
      // Update existing task
      tasks.update(task.id, formData);
    } else {
      // Create new task
      tasks.add(formData);
    }

    dispatch('close');
  }

  function handleClose() {
    dispatch('close');
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="modal-backdrop" on:click={handleBackdropClick}>
  <div class="modal" bind:this={modalElement}>
    <div class="modal-header">
      <h2 class="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
      <button class="close-btn" on:click={handleClose} aria-label="Close modal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <form class="modal-body" on:submit|preventDefault={handleSubmit}>
      <!-- Title -->
      <div class="form-group">
        <label for="task-title" class="form-label">Task Title *</label>
        <input
          id="task-title"
          type="text"
          class="form-input"
          placeholder="Enter task title..."
          bind:value={formData.title}
          autofocus
        />
      </div>

      <!-- Category & Priority -->
      <div class="form-row">
        <div class="form-group">
          <label for="task-category" class="form-label">Category</label>
          <select id="task-category" class="form-select" bind:value={formData.category}>
            {#each categories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label for="task-priority" class="form-label">Priority</label>
          <select id="task-priority" class="form-select" bind:value={formData.priority}>
            {#each priorities as priority}
              <option value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Due Date -->
      <div class="form-group">
        <label for="task-due-date" class="form-label">Due Date</label>
        <input
          id="task-due-date"
          type="date"
          class="form-input"
          bind:value={formData.dueDate}
        />
      </div>

      <!-- Recurring -->
      <div class="form-group">
        <label for="task-recurring" class="form-label">Recurring</label>
        <select id="task-recurring" class="form-select" bind:value={formData.recurring}>
          {#each recurringOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>

      <!-- Weather Info (if due date is set) -->
      {#if formData.dueDate}
        {#if dateWeather}
          <div class="weather-info">
            <div class="weather-icon">{dateWeather.icon}</div>
            <div class="weather-text">
              <span class="weather-temp">{dateWeather.high}°C / {dateWeather.low}°C</span>
              <span class="weather-condition">{dateWeather.condition}</span>
              {#if dateWeather.precipitationProbability > 0}
                <span class="weather-precip">💧 {dateWeather.precipitationProbability}% chance of rain</span>
              {/if}
            </div>
          </div>
        {:else if $weather.loading}
          <div class="weather-info loading">
            <div class="weather-spinner"></div>
            <span class="weather-text">Loading weather...</span>
          </div>
        {:else}
          <div class="weather-info unavailable">
            <div class="weather-icon">📅</div>
            <span class="weather-text">Weather forecast not available for this date</span>
          </div>
        {/if}
      {/if}

      <!-- Actions -->
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" on:click={handleClose}>
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    width: 100%;
    max-width: 500px;
    background-color: var(--color-bg);
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
  }

  .close-btn {
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

  .close-btn:hover {
    background-color: var(--color-bg-secondary);
    color: var(--color-text);
  }

  .modal-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
  }

  .form-input,
  .form-select {
    padding: 0.75rem;
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--color-text);
    transition: all 0.2s ease;
  }

  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-input::placeholder {
    color: var(--color-text-secondary);
  }

  .form-select {
    cursor: pointer;
  }

  .weather-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--color-bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--color-border);
  }

  .weather-icon {
    font-size: 2rem;
  }

  .weather-text {
    display: flex;
    flex-direction: column;
  }

  .weather-temp {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .weather-condition {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .weather-precip {
    font-size: 0.75rem;
    color: var(--color-primary);
    margin-top: 0.25rem;
  }

  .weather-info.loading,
  .weather-info.unavailable {
    justify-content: center;
  }

  .weather-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .btn {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-secondary {
    background-color: var(--color-bg-secondary);
    color: var(--color-text);
  }

  .btn-secondary:hover {
    background-color: var(--color-bg-tertiary);
  }

  .btn-primary {
    background-color: var(--color-primary);
    color: white;
  }

  .btn-primary:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    .modal {
      max-width: 100%;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
