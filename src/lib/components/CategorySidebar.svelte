<script>
  import { notes, uiState, categories } from '../stores/appStore.js';

  const presetColors = [
    '#4DB8FF', '#317ee4', '#3498db', '#483D8B',
    '#9b59b6', '#5B4A99', '#9B9FD8', '#FF1493',
    '#e74c3c', '#FF6347', '#f3893e', '#FF8C00',
    '#D4AF37', '#D4E842', '#9ACD32', '#7CFC00',
    '#4CD964', '#2E8B57', '#16a085', '#48C9B0',
    '#8B4513', '#704214', '#6B3629', '#CD853F',
    '#8B7355', '#BC8F8F', '#D3D3A3', '#6C6C70',
  ];

  let editingId = null;
  let editName = '';
  let editColor = '';
  let hoveredId = null;
  let showColorPicker = null;
  let isCreating = false;
  let newName = '';
  let newColor = '#4DB8FF';

  $: categoryCounts = $categories.reduce((acc, cat) => {
    acc[cat.name] = $notes.filter(note => note.category === cat.name).length;
    return acc;
  }, {});

  $: totalNotes = $notes.length;

  function selectCategory(categoryName) {
    if (editingId || isCreating) return;
    uiState.update(state => ({ ...state, filterCategory: categoryName }));
  }

  function selectAll() {
    if (editingId || isCreating) return;
    uiState.update(state => ({ ...state, filterCategory: null }));
  }

  function startEdit(category) {
    editingId = category.id;
    editName = category.name;
    editColor = category.color;
    showColorPicker = null;
  }

  function saveEdit() {
    if (editName.trim()) {
      const oldCat = $categories.find(c => c.id === editingId);
      if (oldCat && oldCat.name !== editName.trim()) {
        $notes.forEach(note => {
          if (note.category === oldCat.name) {
            notes.update(note.id, { category: editName.trim() });
          }
        });
      }
      categories.update(editingId, { name: editName.trim(), color: editColor });
    }
    cancelEdit();
  }

  function cancelEdit() {
    editingId = null;
    editName = '';
    editColor = '';
    showColorPicker = null;
  }

  function deleteCategory(id) {
    const cat = $categories.find(c => c.id === id);
    if (cat && confirm(`Are you sure you want to delete "${cat.name}"? Notes in this category will not be deleted.`)) {
      categories.delete(id);
      cancelEdit();
    }
  }

  function startCreate() {
    isCreating = true;
    newName = '';
    newColor = '#4DB8FF';
    showColorPicker = null;
  }

  function saveCreate() {
    if (newName.trim()) {
      categories.add({ name: newName.trim(), color: newColor });
    }
    cancelCreate();
  }

  function cancelCreate() {
    isCreating = false;
    newName = '';
    newColor = '#4DB8FF';
    showColorPicker = null;
  }

  function toggleColorPicker(id) {
    showColorPicker = showColorPicker === id ? null : id;
  }

  function handleKeydown(event, action) {
    if (event.key === 'Enter') action();
    if (event.key === 'Escape') {
      cancelEdit();
      cancelCreate();
    }
  }
</script>

<aside class="category-sidebar">
  <div class="sidebar-logo">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_53_427)">
        <path d="M13.327 31.9997H12.3056C9.65251 31.9997 8.05627 31.9992 6.83691 31.7724L13.8937 22.4272L13.327 31.9997Z" fill="white"/>
        <path d="M24.9984 31.8012C23.8 31.9991 22.2299 32.0001 19.6945 32.0001H18.4871L17.9175 22.4248L24.9984 31.8012Z" fill="white"/>
        <path d="M31.7371 25.3364C31.6855 25.5816 31.6249 25.8122 31.551 26.0338C31.0668 27.4851 30.2168 28.7615 29.1092 29.7583L21.1519 20.835L31.7371 25.3364Z" fill="white"/>
        <path d="M2.78822 29.6636C1.73104 28.6812 0.917779 27.4403 0.448731 26.0344C0.367508 25.7908 0.300069 25.5371 0.245605 25.2645L10.659 20.8369L2.78822 29.6636Z" fill="white"/>
        <path d="M31.9998 19.6946C31.9998 20.5942 31.9972 21.3723 31.9884 22.0553L22.5381 18.4048H31.9998V19.6946Z" fill="white"/>
        <path d="M9.27696 18.4048L0.00852272 21.9844C0.000564884 21.3185 0 20.5632 0 19.6946V18.4048H9.27696Z" fill="white"/>
        <path d="M19.6946 0C23.0246 0 24.6896 0.000442934 26.0341 0.448864C28.6383 1.3177 30.6823 3.36166 31.5511 5.96591C31.9995 7.31038 32 8.97544 32 12.3054V16.0128H22.0071L29.2145 12.9489L27.0767 11.5298L20.0838 14.2301L23.3665 9.8864L21.0057 9.24008L17.3807 13.3026L17.1108 8.72728H14.706L14.4318 13.3026L10.8097 9.24008L8.45032 9.8864L11.7287 14.2287L4.74006 11.5298L2.60227 12.9489L9.80824 16.0128H0V12.3054C0 8.97544 0.000442934 7.31038 0.448864 5.96591C1.3177 3.36166 3.36166 1.3177 5.96591 0.448864C7.31038 0.000442934 8.97544 0 12.3054 0H19.6946Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_53_427">
          <rect width="32" height="32" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  </div>

  <div class="category-list">
    <!-- New Category button -->
    <button class="new-category-btn" on:click={startCreate}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      New category
    </button>

    <!-- New category inline form -->
    {#if isCreating}
      <div class="category-item editing">
        <button
          class="color-dot-btn"
          style="background-color: {newColor}"
          on:click={() => toggleColorPicker('new')}
          aria-label="Choose color"
        ></button>
        <input
          class="category-input"
          bind:value={newName}
          on:keydown={(e) => handleKeydown(e, saveCreate)}
          placeholder="Category name"
          autofocus
        />
        <button class="edit-action-btn save" on:click={saveCreate} aria-label="Save">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
        <button class="edit-action-btn cancel" on:click={cancelCreate} aria-label="Cancel">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      {#if showColorPicker === 'new'}
        <div class="color-picker">
          {#each presetColors as color}
            <button
              class="color-swatch"
              class:selected={newColor === color}
              style="background-color: {color}"
              on:click={() => { newColor = color; showColorPicker = null; }}
              aria-label="Color {color}"
            ></button>
          {/each}
        </div>
      {/if}
    {/if}

    <!-- All Notes -->
    <button
      class="category-item"
      class:active={$uiState.filterCategory === null}
      on:click={selectAll}
    >
      <span class="category-dot" style="background-color: #317ee4"></span>
      <span class="category-name">All Notes</span>
      <span class="category-count">{totalNotes}</span>
    </button>

    <!-- Categories -->
    {#each $categories as category (category.id)}
      {#if editingId === category.id}
        <!-- Editing mode -->
        <div class="category-item editing">
          <button
            class="color-dot-btn"
            style="background-color: {editColor}"
            on:click={() => toggleColorPicker(category.id)}
            aria-label="Choose color"
          ></button>
          <input
            class="category-input"
            bind:value={editName}
            on:keydown={(e) => handleKeydown(e, saveEdit)}
            autofocus
          />
          <button class="edit-action-btn save" on:click={saveEdit} aria-label="Save">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
          <button class="edit-action-btn delete" on:click={() => deleteCategory(category.id)} aria-label="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
        {#if showColorPicker === category.id}
          <div class="color-picker">
            {#each presetColors as color}
              <button
                class="color-swatch"
                class:selected={editColor === color}
                style="background-color: {color}"
                on:click={() => { editColor = color; showColorPicker = null; }}
                aria-label="Color {color}"
              ></button>
            {/each}
          </div>
        {/if}
      {:else}
        <!-- Normal mode -->
        <button
          class="category-item"
          class:active={$uiState.filterCategory === category.name}
          on:click={() => selectCategory(category.name)}
          on:mouseenter={() => hoveredId = category.id}
          on:mouseleave={() => hoveredId = null}
        >
          <span class="category-dot" style="background-color: {category.color}"></span>
          <span class="category-name">{category.name}</span>
          {#if hoveredId === category.id}
            <button
              class="edit-btn"
              on:click|stopPropagation={() => startEdit(category)}
              aria-label="Edit category"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          {:else}
            <span class="category-count">{categoryCounts[category.name] || 0}</span>
          {/if}
        </button>
      {/if}
    {/each}
  </div>
</aside>

<style>
  .category-sidebar {
    width: 280px;
    height: 100vh;
    position: sticky;
    top: 0;
    background-color: #222224;
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .sidebar-logo {
    height: 72px;
    display: flex;
    align-items: center;
    padding: 16px 8px 16px 24px;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .category-list {
    padding: 16px 12px;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .new-category-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 40px;
    padding: 0 12px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'Geist', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-muted);
    transition: all 0.15s ease;
    text-align: left;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 16px;
    margin-bottom: 4px;
  }

  .new-category-btn:hover {
    color: var(--color-text);
  }

  .category-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 40px;
    padding: 0 12px;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.15s ease;
    text-align: left;
  }

  .category-item:hover {
    background-color: var(--color-bg-tertiary);
  }

  .category-item.active {
    background-color: var(--color-bg-tertiary);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0 13px;
  }

  .category-item.editing {
    background-color: var(--color-bg-tertiary);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 0 8px;
    cursor: default;
  }

  .category-dot {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    flex-shrink: 0;
  }

  .color-dot-btn {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    flex-shrink: 0;
    border: 2px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: border-color 0.15s ease;
    padding: 0;
  }

  .color-dot-btn:hover {
    border-color: rgba(255, 255, 255, 0.5);
  }

  .category-name {
    flex: 1;
    font-family: 'Geist', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--color-text);
  }

  .category-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'Geist', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--color-text);
    padding: 0;
    min-width: 0;
  }

  .category-input::placeholder {
    color: var(--color-text-muted);
  }

  .category-count {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: #6C6C70;
  }

  .edit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 4px;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
    padding: 0;
    flex-shrink: 0;
  }

  .edit-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--color-text);
  }

  .edit-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
    padding: 0;
    flex-shrink: 0;
  }

  .edit-action-btn.save {
    color: #4CD964;
  }

  .edit-action-btn.save:hover {
    background-color: rgba(76, 217, 100, 0.15);
  }

  .edit-action-btn.delete {
    color: #FF6347;
  }

  .edit-action-btn.delete:hover {
    background-color: rgba(255, 99, 71, 0.15);
  }

  .edit-action-btn.cancel {
    color: var(--color-text-muted);
  }

  .edit-action-btn.cancel:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--color-text);
  }

  .color-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 8px 12px;
    background-color: var(--color-bg-tertiary);
    border-radius: 8px;
    margin-top: -4px;
  }

  .color-swatch {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 0;
    transition: all 0.15s ease;
  }

  .color-swatch:hover {
    transform: scale(1.2);
  }

  .color-swatch.selected {
    border-color: white;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  }

  .category-sidebar::-webkit-scrollbar {
    width: 6px;
  }

  .category-sidebar::-webkit-scrollbar-track {
    background: transparent;
  }

  .category-sidebar::-webkit-scrollbar-thumb {
    background: var(--color-bg-tertiary);
    border-radius: 3px;
  }

  .category-sidebar::-webkit-scrollbar-thumb:hover {
    background: #3A3A3C;
  }
</style>
