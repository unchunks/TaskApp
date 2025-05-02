export const checkDueDates = (todos) => {
    const now = new Date();
    todos.forEach(todo => {
        if (!todo.completed && todo.dueDateTime) {
            const dueDate = new Date(todo.dueDateTime);
            const timeDiff = dueDate - now;

            // 期限が1時間以内の場合に通知
            if (timeDiff > 0 && timeDiff <= 3600000) {
                if (Notification.permission === 'granted') {
                    new Notification('タスクの期限が近づいています', {
                        body: `${todo.text}の期限が1時間以内です`,
                        icon: '/logo192.png'
                    });
                }
            }
        }
    });
};
