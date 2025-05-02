/**
 * タスクの期限をチェックし、期限が1時間以内に迫っているタスクがあれば通知を送る
 * 
 * @param {Array} todos - タスクの配列
 */
export const checkDueDates = (todos) => {
    const now = new Date(); // 現在の日時を取得

    todos.forEach(todo => {
        // 未完了かつ締切日時が設定されているタスクのみ対象
        if (!todo.completed && todo.dueDateTime) {
            const dueDate = new Date(todo.dueDateTime); // タスクの締切をDate型に変換
            const timeDiff = dueDate - now; // 締切までの残り時間（ミリ秒）

            // 締切まで1時間以内（かつまだ時間が残っている）場合に通知
            if (timeDiff > 0 && timeDiff <= 3600000) {
                // 通知の許可がユーザーから与えられているかチェック
                if (Notification.permission === 'granted') {
                    // ブラウザ通知を表示
                    new Notification('タスクの期限が近づいています', {
                        body: `${todo.text}の期限が1時間以内です`, // 通知本文
                        icon: '/logo192.png' // 通知に表示するアイコン（アプリのアイコンなど）
                    });
                }
            }
        }
    });
};
