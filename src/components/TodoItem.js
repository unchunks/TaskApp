import React, { memo } from 'react';
import {
  Box,
  Checkbox,
  Typography,
  IconButton,
  Paper,
  Chip,
  Stack,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { formatDueDateTime } from '../utils/dateUtils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getContrastTextColor, setColorOpacity } from '../utils/colorUtils';

const getPriorityStars = (priority) => {
  return '★'.repeat(priority) + '☆'.repeat(5 - priority);
};

/**
 * タスク1件分を表示するコンポーネント
 * 
 * @param {Object} props.todo - 表示するタスクのデータ
 * @param {Function} props.toggleTodo - 完了状態の切り替え関数
 * @param {Function} props.deleteTodo - タスク削除の関数
 * @param {Function} props.startEditing - 編集開始関数
 * @param {Function} props.openImageModal - 画像クリック時にモーダルを開く関数
 * @param {Object | null} props.group - タスクが所属するグループオブジェクト（なければnull）
 * @param {boolean} props.isDragging - Optional prop to indicate if the item is currently being dragged
 */
const TodoItem = memo(React.forwardRef(({ todo, toggleTodo, deleteTodo, startEditing, openImageModal, group, isDragging }, ref) => {
  const theme = useTheme();

  const getPriorityColor = (priority) => {
    return theme.palette.priority[priority] || theme.palette.primary.main;
  };

  const getPriorityTextColor = (priority) => {
    const color = getPriorityColor(priority);
    return getContrastTextColor(color);
  };

  const itemStyle = isDragging
    ? {
        transform: 'scale(1.02)',
        boxShadow: theme.shadows[4],
        transition: 'all 0.2s ease',
      }
    : {};

  const isOverdue = todo.dueDateTime && !todo.completed && new Date(todo.dueDateTime) < new Date();

  return (
    <Paper
      ref={ref}
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        opacity: todo.completed ? 0.7 : 1,
        ...itemStyle,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Checkbox
          checked={todo.completed}
          onChange={(e) => {
            e.stopPropagation();
            toggleTodo(todo.id);
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            {group && (
              <Chip
                label={group.name}
                size="small"
                sx={{
                  backgroundColor: group.color,
                  color: getContrastTextColor(group.color),
                  '&:hover': {
                    backgroundColor: setColorOpacity(group.color, 0.9),
                  },
                }}
                onClick={() => { }}
              />
            )}

            <Chip
              label={getPriorityStars(todo.priority)}
              size="small"
              sx={{
                backgroundColor: getPriorityColor(todo.priority),
                color: getPriorityTextColor(todo.priority),
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                '&:hover': {
                  backgroundColor: setColorOpacity(getPriorityColor(todo.priority), 0.9),
                },
              }}
              onClick={() => { }}
            />
          </Stack>

          <Typography
            variant="body1"
            sx={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? 'text.secondary' : 'text.primary',
              wordBreak: 'break-word',
            }}
          >
            {todo.text}
          </Typography>

          {todo.dueDateTime && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 1,
                color: isOverdue ? 'error.main' : 'text.secondary',
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              期限: {format(new Date(todo.dueDateTime), 'M月d日 HH:mm', { locale: ja })}
            </Typography>
          )}

          {todo.images && todo.images.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={1}>
                {todo.images.map((image, index) => (
                  <Grid item key={index} xs={3} sm={2} md={1.5}>
                    <Box
                      component="img"
                      src={image}
                      alt={`添付画像 ${index + 1}`}
                      onClick={() => openImageModal(image)}
                      sx={{
                        display: 'block',
                        width: '80px',
                        height: 'auto',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              startEditing(todo);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              deleteTodo(todo.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}));

export default TodoItem;
