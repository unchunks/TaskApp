import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { compressImage } from '../utils/imageUtils';

const EditTodoModal = ({ todo, onClose, onSubmit, groups, addGroup }) => {
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState(todo.dueDateTime ? todo.dueDateTime.split('T')[0] : '');
  const [editDueTime, setEditDueTime] = useState(todo.dueDateTime ? todo.dueDateTime.split('T')[1] : '');
  const [editPriority, setEditPriority] = useState(Number(todo.priority) || 3);
  const [editImages, setEditImages] = useState(todo.images || []);
  const [selectedGroupId, setSelectedGroupId] = useState(todo.groupId || '');
  const [showNewGroupInputs, setShowNewGroupInputs] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#6750A4');

  const handleSubmit = (e) => {
    e.preventDefault();
    const dueDateTime = editDueDate && editDueTime ? `${editDueDate}T${editDueTime}` : null;

    onSubmit({
      ...todo,
      text: editText.trim(),
      dueDateTime,
      priority: editPriority,
      images: editImages,
      groupId: selectedGroupId === 'create_new_group' ? null : selectedGroupId,
    });
  };

  const handleGroupChange = (event) => {
    const value = event.target.value;
    setSelectedGroupId(value);
    if (value === 'create_new_group') {
      setShowNewGroupInputs(true);
    } else {
      setShowNewGroupInputs(false);
    }
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup({
        name: newGroupName.trim(),
        color: newGroupColor,
      });
      setNewGroupName('');
      setNewGroupColor('#6750A4');
      setShowNewGroupInputs(false);
      setSelectedGroupId('');
    }
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    for (const file of files) {
      const reader = new FileReader();
      const imageData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
      const compressedImage = await compressImage(imageData);
      newImages.push(compressedImage);
    }
    setEditImages([...editImages, ...newImages]);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        タスクを編集
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.primary',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="タスク"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              variant="outlined"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="date"
                label="期限日"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />
              <TextField
                type="time"
                label="期限時間"
                value={editDueTime}
                onChange={(e) => setEditDueTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ flex: 1 }}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>優先度</InputLabel>
              <Select
                value={editPriority}
                label="優先度"
                onChange={(e) => setEditPriority(Number(e.target.value))}
              >
                <MenuItem value={1}>★☆☆☆☆</MenuItem>
                <MenuItem value={2}>★★☆☆☆</MenuItem>
                <MenuItem value={3}>★★★☆☆</MenuItem>
                <MenuItem value={4}>★★★★☆</MenuItem>
                <MenuItem value={5}>★★★★★</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>グループ</InputLabel>
              <Select
                value={selectedGroupId}
                label="グループ"
                onChange={handleGroupChange}
              >
                <MenuItem value="">なし</MenuItem>
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
                <MenuItem value="create_new_group">新しいグループを作成</MenuItem>
              </Select>
            </FormControl>

            {showNewGroupInputs && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="グループ名"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  type="color"
                  label="色"
                  value={newGroupColor}
                  onChange={(e) => setNewGroupColor(e.target.value)}
                  sx={{ width: 100 }}
                />
                <Button
                  variant="contained"
                  onClick={handleAddGroup}
                  disabled={!newGroupName.trim()}
                >
                  追加
                </Button>
              </Box>
            )}

            {editImages.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  添付画像:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {editImages.map((image, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={image}
                      alt={`Attached ${index + 1}`}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!editText.trim()}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTodoModal;
