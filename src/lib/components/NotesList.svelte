<script>
  import { notes, uiState, settings } from '../stores/appStore.js';
  import NoteCard from './NoteCard.svelte';
  import NoteModal from './NoteModal.svelte';

  // Filter notes based on category from uiState (controlled by CategorySidebar)
  $: filterCategory = $uiState.filterCategory;
  let sortBy = 'created';

  const categories = ['Personal', 'Work', 'Shopping', 'Health', 'Other'];
  const priorities = ['low', 'medium', 'high'];

  $: filteredNotes = $notes
    .filter(note => !filterCategory || note.category === filterCategory)
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

  $: incompleteNotes = filteredNotes.filter(note => !note.completed);
  $: completedNotes = filteredNotes.filter(note => note.completed);

  function openNoteModal() {
    uiState.update(state => ({ ...state, noteModalOpen: true, selectedNote: null }));
  }

  function closeNoteModal() {
    uiState.update(state => ({ ...state, noteModalOpen: false, selectedNote: null }));
  }

  function handleEditNote(event) {
    uiState.update(state => ({ ...state, noteModalOpen: true, selectedNote: event.detail }));
  }

  function handleDeleteNote(event) {
    notes.delete(event.detail.id);
  }

  function handleToggleNote(event) {
    notes.toggle(event.detail.id);
  }
</script>

<div class="notes-container">
  <!-- Toolbar -->
  <div class="toolbar">
    <div class="toolbar-left">
      <h2 class="section-title">My Notes</h2>
      <span class="note-count">{incompleteNotes.length} active</span>
    </div>
    <button class="add-button" on:click={openNoteModal}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Add Note
    </button>
  </div>

  <!-- Sort (filters removed - now in CategorySidebar) -->
  <div class="controls">
    <div class="sort-select-wrapper">
      <label for="sort-select" class="sort-label">Sort by:</label>
      <select id="sort-select" class="sort-select" bind:value={sortBy}>
        <option value="created">Date Created</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  </div>

  <!-- Notes List -->
  <div class="notes-list">
    {#if incompleteNotes.length === 0 && completedNotes.length === 0}
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No notes yet</h3>
        <p>Add your first note to get started!</p>
      </div>
    {:else}
      <!-- Incomplete Notes -->
      {#if incompleteNotes.length > 0}
        <div class="notes-section">
          {#each incompleteNotes as note (note.id)}
            <NoteCard
              note={note}
              on:edit={handleEditNote}
              on:delete={handleDeleteNote}
              on:toggle={handleToggleNote}
            />
          {/each}
        </div>
      {/if}

      <!-- Completed Notes -->
      {#if completedNotes.length > 0}
        <div class="notes-section completed-section">
          <h3 class="section-subtitle">Completed ({completedNotes.length})</h3>
          {#each completedNotes as note (note.id)}
            <NoteCard
              note={note}
              on:edit={handleEditNote}
              on:delete={handleDeleteNote}
              on:toggle={handleToggleNote}
            />
          {/each}
        </div>
      {/if}
    {/if}
  </div>
</div>

<!-- Note Modal -->
{#if $uiState.noteModalOpen}
  <NoteModal
    note={$uiState.selectedNote}
    on:close={closeNoteModal}
  />
{/if}

<style>
  .notes-container {
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

  .note-count {
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
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
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

  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .notes-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    align-items: start;
  }

  /* Responsive grid columns */
  @media (min-width: 1400px) {
    .notes-section {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1024px) and (max-width: 1399px) {
    .notes-section {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .notes-section {
      grid-template-columns: repeat(2, 1fr);
    }
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
    .notes-container {
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
