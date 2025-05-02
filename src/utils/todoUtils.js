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
    // 元の配列を破壊しないようにコピー
    const sortedTodos = [...todos];

    // ソート基準に応じて処理を分岐
    switch (sortBy) {
        // 作成順（IDが大きいもの＝新しいものを先に）
        case 'created':
            sortedTodos.sort((a, b) => b.id - a.id);
            break;

        // 締切順（日時が近い順）でソート
        case 'due':
            sortedTodos.sort((a, b) => {
                // 締切が両方とも未設定なら順序を変えない
                if (!a.dueDateTime && !b.dueDateTime) return 0;
                // aが未設定なら後ろへ
                if (!a.dueDateTime) return 1;
                // bが未設定なら後ろへ
                if (!b.dueDateTime) return -1;
                // 両方設定されていれば日時で昇順に比較
                return new Date(a.dueDateTime) - new Date(b.dueDateTime);
            });
            break;

        // 完了状態でソート（未完了→完了）。同じ状態なら作成順に。
        case 'completed':
            sortedTodos.sort((a, b) => {
                if (a.completed === b.completed) {
                    // 状態が同じ場合、作成順（ID降順）で比較
                    return b.id - a.id;
                }
                // 未完了（false）を先に、完了（true）を後に
                return a.completed ? 1 : -1;
            });
            break;

        // 名前（テキスト）順でソート（日本語も含めたローカライズ済み比較）
        case 'name':
            sortedTodos.sort((a, b) => {
                const textA = a.text.toLowerCase();
                const textB = b.text.toLowerCase();
                // 文字列をローカライズ順（日本語）で比較
                return textA.localeCompare(textB, 'ja');
            });
            break;

        // 優先度順でソート
        case 'priority':
            sortedTodos.sort((a, b) => {
                // priority が null or undefined の場合は 0 にフォールバック
                const pA = a.priority ?? 0;
                const pB = b.priority ?? 0;
                // 優先度が高い方を上に
                return pB - pA;
            });
            break;

        // 無効な sortBy の場合は何もしない
        default:
            break;
    }

    // ソート順が「降順（desc）」でなければ昇順に反転
    return sortOrder === 'desc' ? sortedTodos : sortedTodos.reverse();
};
