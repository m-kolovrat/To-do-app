import { writable, derived } from 'svelte/store';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';

// Load initial data from localStorage
const initialData = loadFromStorage();

// Notes store
function createNotesStore() {
  const { subscribe, set, update } = writable(initialData.notes);

  return {
    subscribe,
    add: (note) => update(notes => {
      const newNote = {
        id: Date.now().toString(),
        name: note.name,
        content: note.content || '',
        category: note.category || 'Personal',
        priority: note.priority || 'medium',
        dueDate: note.dueDate || null,
        recurring: note.recurring || null,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const updatedNotes = [...notes, newNote];
      saveData({ notes: updatedNotes });
      return updatedNotes;
    }),
    update: (id, updates) => update(notes => {
      const updatedNotes = notes.map(note =>
        note.id === id ? { ...note, ...updates } : note
      );
      saveData({ notes: updatedNotes });
      return updatedNotes;
    }),
    delete: (id) => update(notes => {
      const updatedNotes = notes.filter(note => note.id !== id);
      saveData({ notes: updatedNotes });
      return updatedNotes;
    }),
    toggle: (id) => update(notes => {
      const updatedNotes = notes.map(note =>
        note.id === id ? { ...note, completed: !note.completed } : note
      );
      saveData({ notes: updatedNotes });
      return updatedNotes;
    }),
    clear: () => {
      set([]);
      saveData({ notes: [] });
    }
  };
}

// Settings store
function createSettingsStore() {
  const { subscribe, set, update } = writable(initialData.settings);

  return {
    subscribe,
    update: (newSettings) => update(settings => {
      const updatedSettings = { ...settings, ...newSettings };
      saveData({ settings: updatedSettings });
      return updatedSettings;
    }),
    setSidebarCollapsed: (collapsed) => update(settings => {
      const updatedSettings = { ...settings, sidebarCollapsed: collapsed };
      saveData({ settings: updatedSettings });
      return updatedSettings;
    }),
    setLocation: (location) => update(settings => {
      const updatedSettings = { ...settings, location };
      saveData({ settings: updatedSettings });
      return updatedSettings;
    }),
    reset: () => {
      const defaultSettings = {
        location: null,
        defaultCategory: 'Personal',
        defaultSort: 'created',
        sidebarCollapsed: false
      };
      set(defaultSettings);
      saveData({ settings: defaultSettings });
    }
  };
}

// Helper function to save data
function saveData(updates) {
  const currentData = loadFromStorage();
  const newData = { ...currentData, ...updates };
  saveToStorage(newData);
}

// Export stores
export const notes = createNotesStore();
export const settings = createSettingsStore();

// Derived stores
export const incompleteNotes = derived(
  notes,
  $notes => $notes.filter(note => !note.completed)
);

export const completedNotes = derived(
  notes,
  $notes => $notes.filter(note => note.completed)
);

// UI state store (not persisted)
export const uiState = writable({
  noteModalOpen: false,
  selectedNote: null,
  filterCategory: null,
  sortBy: 'created'
});
