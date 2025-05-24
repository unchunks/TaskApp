/**
 * タスクのリストを指定された条件でソートする関数
 * 
 * @param {Array} todos - タスクの配列
 * @param {string} sortBy - ソート基準（'created' | 'due' | 'completed' | 'name' | 'priority'）
 * @param {string} sortOrder - ソート順序（'asc' | 'desc'）
 * @returns {Array} - ソート済みのタスク配列
 * 
 */
export const sortTodos = (todos, sortBy, sortOrder) => {
    const sorted = [...todos]; // Create a shallow copy to avoid mutating the original array

    // Ensure all todos have a manualOrder for reliable sorting
    // This is a safeguard; App.js should already handle this for new and existing todos
    sorted.forEach((todo, index) => {
      if (typeof todo.manualOrder !== 'number') {
        // Assign a default manualOrder based on current index if missing.
        // For 'manual' sort, lower numbers usually come first.
        // If a todo is missing manualOrder, it will be placed based on its position
        // before sorting, which is a reasonable default.
        todo.manualOrder = index; 
      }
    });

    switch (sortBy) {
      case 'created':
        // ID is typically a timestamp or auto-incrementing number.
        // For 'created', 'desc' (newest first) usually means higher ID first.
        // 'asc' (oldest first) means lower ID first.
        sorted.sort((a, b) => sortOrder === 'asc' ? (a.id || 0) - (b.id || 0) : (b.id || 0) - (a.id || 0));
        break;
      case 'due':
        sorted.sort((a, b) => {
          const dateA = a.dueDateTime ? new Date(a.dueDateTime) : null;
          const dateB = b.dueDateTime ? new Date(b.dueDateTime) : null;

          if (!dateA && !dateB) return 0; // Both null, keep order

          // For 'asc' (due sooner), nulls (no due date) should go last.
          // For 'desc' (due later), nulls should go first (or last, depending on preference, here last).
          if (!dateA) return sortOrder === 'asc' ? 1 : -1; 
          if (!dateB) return sortOrder === 'asc' ? -1 : 1;
          
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        break;
      case 'completed':
        sorted.sort((a, b) => {
          // Primary sort by completion status
          // For 'asc', incomplete (false) usually come before complete (true).
          // For 'desc', complete (true) usually come before incomplete (false).
          let comparison = 0;
          if (a.completed !== b.completed) {
            comparison = sortOrder === 'asc' ? (a.completed ? 1 : -1) : (a.completed ? -1 : 1);
          } else {
            // Secondary sort by creation order (e.g., ID or manualOrder) if completion status is the same
            // Using ID: older first for asc, newer first for desc as a tie-breaker
            comparison = sortOrder === 'asc' ? (a.id || 0) - (b.id || 0) : (b.id || 0) - (a.id || 0);
          }
          return comparison;
        });
        break;
      case 'name':
        sorted.sort((a, b) => {
          const nameA = (a.text || '').toLowerCase(); // Handle potentially undefined text
          const nameB = (b.text || '').toLowerCase();
          // localeCompare is suitable for string comparison respecting locale
          return sortOrder === 'asc' ? nameA.localeCompare(nameB, 'ja') : nameB.localeCompare(nameA, 'ja');
        });
        break;
      case 'priority':
        sorted.sort((a, b) => {
          // Higher priority number means higher priority.
          // For 'asc' (lower priority first), sort by ascending priority number.
          // For 'desc' (higher priority first), sort by descending priority number.
          const pA = typeof a.priority === 'number' ? a.priority : 0; // Default to 0 if undefined
          const pB = typeof b.priority === 'number' ? b.priority : 0;
          
          let comparison = 0;
          if (pA !== pB) {
            comparison = sortOrder === 'asc' ? pA - pB : pB - pA;
          } else {
            // Secondary sort by creation order if priorities are the same
            comparison = sortOrder === 'asc' ? (a.id || 0) - (b.id || 0) : (b.id || 0) - (a.id || 0);
          }
          return comparison;
        });
        break;
      case 'manual': // New case for manual sorting
        sorted.sort((a, b) => {
          // Assumes manualOrder is a number, lower numbers come first.
          // Default to 0 if manualOrder is not a number, though App.js tries to prevent this.
          const orderA = typeof a.manualOrder === 'number' ? a.manualOrder : 0;
          const orderB = typeof b.manualOrder === 'number' ? b.manualOrder : 0;
          return sortOrder === 'asc' ? orderA - orderB : orderB - orderA;
        });
        break;
      default:
        // Optionally, return original array or sort by a default like creation if sortBy is unknown
        // For now, returns the array with manualOrder defaults applied if any were missing.
        break;
    }
    return sorted;
};
