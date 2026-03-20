import { writable, derived } from 'svelte/store';
import { loadFromStorage, saveToStorage } from '../utils/storage.js';

// Load initial data from localStorage
const initialData = loadFromStorage();

// Tasks store
function createTasksStore() {
  const { subscribe, set, update } = writable(initialData.tasks);

  return {
    subscribe,
    add: (task) => update(tasks => {
      const newTask = {
        id: Date.now().toString(),
        title: task.title,
        category: task.category || 'Personal',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || null,
        recurring: task.recurring || null,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const updatedTasks = [...tasks, newTask];
      saveData({ tasks: updatedTasks });
      return updatedTasks;
    }),
    update: (id, updates) => update(tasks => {
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      );
      saveData({ tasks: updatedTasks });
      return updatedTasks;
    }),
    delete: (id) => update(tasks => {
      const updatedTasks = tasks.filter(task => task.id !== id);
      saveData({ tasks: updatedTasks });
      return updatedTasks;
    }),
    toggle: (id) => update(tasks => {
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      saveData({ tasks: updatedTasks });
      return updatedTasks;
    }),
    clear: () => {
      set([]);
      saveData({ tasks: [] });
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
    setSidebarPosition: (position) => update(settings => {
      const updatedSettings = { ...settings, sidebarPosition: position };
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
        sidebarPosition: 'right',
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
export const tasks = createTasksStore();
export const settings = createSettingsStore();

// Derived stores
export const incompleteTasks = derived(
  tasks,
  $tasks => $tasks.filter(task => !task.completed)
);

export const completedTasks = derived(
  tasks,
  $tasks => $tasks.filter(task => task.completed)
);

// UI state store (not persisted)
export const uiState = writable({
  taskModalOpen: false,
  selectedTask: null,
  filterCategory: null,
  sortBy: 'created'
});
