export const sortTodos = (todos, sortBy, sortOrder) => {
    const sortedTodos = [...todos];

    switch (sortBy) {
        case 'created':
            sortedTodos.sort((a, b) => b.id - a.id);
            break;
        case 'due':
            sortedTodos.sort((a, b) => {
                if (!a.dueDateTime && !b.dueDateTime) return 0;
                if (!a.dueDateTime) return 1;
                if (!b.dueDateTime) return -1;
                return new Date(a.dueDateTime) - new Date(b.dueDateTime);
            });
            break;
        case 'completed':
            sortedTodos.sort((a, b) => {
                if (a.completed === b.completed) return b.id - a.id;
                return a.completed ? 1 : -1;
            });
            break;
        case 'name':
            sortedTodos.sort((a, b) => {
                const textA = a.text.toLowerCase();
                const textB = b.text.toLowerCase();
                return textA.localeCompare(textB, 'ja');
            });
            break;
        default:
            break;
    }

    return sortOrder === 'desc' ? sortedTodos : sortedTodos.reverse();
};
