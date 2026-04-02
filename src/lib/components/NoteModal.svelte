<script>
  import { createEventDispatcher } from 'svelte';
  import { notes, categories } from '../stores/appStore.js';
  import { weather } from '../stores/weatherStore.js';
  import { getWeatherForDate } from '../utils/weatherService.js';
  import { animate } from 'motion';

  export let note = null;

  const dispatch = createEventDispatcher();
  const priorities = ['low', 'medium', 'high'];
  const recurringOptions = [
    { value: null, label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  let formData = {
    name: note?.name || '',
    content: note?.content || '',
    category: note?.category || 'Personal',
    priority: note?.priority || 'medium',
    dueDate: note?.dueDate || '',
    recurring: note?.recurring || null
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
    if (!formData.name.trim()) {
      alert('Please enter a note name');
      return;
    }

    if (note) {
      // Update existing note
      notes.update(note.id, formData);
    } else {
      // Create new note
      notes.add(formData);
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
      <h2 class="modal-title">{note ? 'Edit Note' : 'New Note'}</h2>
      <button class="close-btn" on:click={handleClose} aria-label="Close modal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <form class="modal-body" on:submit|preventDefault={handleSubmit}>
      <!-- Note Name -->
      <div class="form-group">
        <label for="note-name" class="form-label">Note Name *</label>
        <input
          id="note-name"
          type="text"
          class="form-input"
          placeholder="Enter note name..."
          bind:value={formData.name}
          autofocus
        />
      </div>

      <!-- Content -->
      <div class="form-group">
        <label for="note-content" class="form-label">Content</label>
        <textarea
          id="note-content"
          class="form-textarea"
          placeholder="Enter note content..."
          bind:value={formData.content}
          rows="5"
        ></textarea>
      </div>

      <!-- Category & Priority -->
      <div class="form-row">
        <div class="form-group">
          <label for="note-category" class="form-label">Category</label>
          <select id="note-category" class="form-select" bind:value={formData.category}>
            {#each $categories as category}
              <option value={category.name}>{category.name}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label for="note-priority" class="form-label">Priority</label>
          <select id="note-priority" class="form-select" bind:value={formData.priority}>
            {#each priorities as priority}
              <option value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Due Date -->
      <div class="form-group">
        <label for="note-due-date" class="form-label">Due Date</label>
        <input
          id="note-due-date"
          type="date"
          class="form-input"
          bind:value={formData.dueDate}
        />
      </div>

      <!-- Recurring -->
      <div class="form-group">
        <label for="note-recurring" class="form-label">Recurring</label>
        <select id="note-recurring" class="form-select" bind:value={formData.recurring}>
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
          {note ? 'Update Note' : 'Create Note'}
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
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    width: 100%;
    max-width: 500px;
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  .modal-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
    letter-spacing: -0.01em;
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
    background-color: var(--color-bg-tertiary);
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
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 0.625rem 0.875rem;
    background-color: var(--color-bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--color-text);
    transition: all 0.2s ease;
    font-family: inherit;
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #3A3A3C;
    box-shadow: none;
  }

  .form-input::placeholder {
    color: var(--color-text-muted);
  }

  .form-select {
    cursor: pointer;
  }

  .weather-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1rem;
    background-color: var(--color-bg-tertiary);
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
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-secondary);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover {
    background-color: #3A3A3C;
    color: var(--color-text);
  }

  .btn-primary {
    background-color: #FFFFFF;
    color: #1A1A1C;
    font-weight: 600;
  }

  .btn-primary:hover {
    background-color: #E5E5E5;
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
