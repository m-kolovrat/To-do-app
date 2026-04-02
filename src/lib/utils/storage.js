/**
 * LocalStorage utility functions for persisting app data
 */

const STORAGE_KEY = 'notes-app';

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
    notes: [],
    categories: [
      { id: '1', name: 'Personal', color: '#4DB8FF' },
      { id: '2', name: 'Work', color: '#D4E842' },
      { id: '3', name: 'Shopping', color: '#f3893e' },
      { id: '4', name: 'Health', color: '#4CD964' },
    ],
    settings: {
      location: null,
      defaultCategory: 'Personal',
      defaultSort: 'created',
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
