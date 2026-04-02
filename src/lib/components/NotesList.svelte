<script>
  import { notes, uiState } from '../stores/appStore.js';
  import NoteCard from './NoteCard.svelte';
  import NoteModal from './NoteModal.svelte';

  $: filterCategory = $uiState.filterCategory;

  $: filteredNotes = $notes
    .filter(note => !filterCategory || note.category === filterCategory)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
      <span class="note-count">{filteredNotes.length}</span>
    </div>
    <button class="add-button" on:click={openNoteModal}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      New Note
    </button>
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
    padding: 32px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 56px;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-title {
    font-family: 'Geist', sans-serif;
    font-size: 24px;
    font-weight: 500;
    margin: 0;
    color: var(--color-text);
    letter-spacing: -0.56px;
    line-height: 30px;
  }

  .note-count {
    font-family: 'Geist', sans-serif;
    font-size: 24px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
    line-height: 42px;
    letter-spacing: -0.56px;
  }

  .add-button {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 32px;
    padding: 10px 12px 10px 8px;
    background-color: #FFFFFF;
    color: #000000;
    border: none;
    border-radius: 6px;
    font-family: 'Geist', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .add-button:hover {
    background-color: #E5E5E5;
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .notes-section {
    display: flex;
    flex-direction: column;
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
      margin-bottom: 2rem;
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
  }
</style>
