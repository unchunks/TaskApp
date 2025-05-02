export const getPriorityColor = (priority) => {
    switch (priority) {
        case 1: return '#62ee4d';
        case 2: return '#a5de49';
        case 3: return '#eada4f';
        case 4: return '#f5ab57';
        case 5: return '#ef6454';
        default: return '#dadada'; // デフォルトはグレー
    }
};

export const getPriorityTextColor = (priority) => {
    switch (priority) {
        case 1: return '#ffffff';
        case 2: return '#ffffff';
        case 3: return '#000000';
        case 4: return '#000000';
        case 5: return '#000000';
        default: return '#000000'; // デフォルトはグレー
    }
};

export const getPriorityStr = (priority) => {
    switch (priority) {
        case 1: return '最低';
        case 2: return '低';
        case 3: return '中';
        case 4: return '高';
        case 5: return '最高';
        default: return 'なし'; // デフォルトはグレー
    }
};