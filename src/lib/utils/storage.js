/**
 * LocalStorage utility functions for persisting app data
 */

const STORAGE_KEY = 'todo-weather-app';

/**
 * Get data from localStorage
 */
export function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getDefaultData();
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return getDefaultData();
  }
}

/**
 * Save data to localStorage
 */
export function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Get default data structure
 */
function getDefaultData() {
  return {
    tasks: [],
    settings: {
      location: null,
      defaultCategory: 'Personal',
      defaultSort: 'created',
      sidebarPosition: 'right',
      sidebarCollapsed: false
    }
  };
}

/**
 * Clear all data from localStorage
 */
export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
