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

// Categories store
function createCategoriesStore() {
  const { subscribe, set, update } = writable(initialData.categories || [
    { id: '1', name: 'Personal', color: '#4DB8FF' },
    { id: '2', name: 'Work', color: '#D4E842' },
    { id: '3', name: 'Shopping', color: '#f3893e' },
    { id: '4', name: 'Health', color: '#4CD964' },
  ]);

  return {
    subscribe,
    add: (category) => update(cats => {
      const newCat = {
        id: Date.now().toString(),
        name: category.name,
        color: category.color
      };
      const updated = [...cats, newCat];
      saveData({ categories: updated });
      return updated;
    }),
    update: (id, updates) => update(cats => {
      const updated = cats.map(cat =>
        cat.id === id ? { ...cat, ...updates } : cat
      );
      saveData({ categories: updated });
      return updated;
    }),
    delete: (id) => update(cats => {
      const updated = cats.filter(cat => cat.id !== id);
      saveData({ categories: updated });
      return updated;
    })
  };
}

// Export stores
export const notes = createNotesStore();
export const settings = createSettingsStore();
export const categories = createCategoriesStore();

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
