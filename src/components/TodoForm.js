import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Paper,
  IconButton,
  Alert,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { compressImage } from '../utils/imageUtils';

/**
 * TodoForm コンポーネント
 * - 新しいToDoを作成するフォーム。
 * - テキスト、期限、画像を入力できる。
 * - 画像の圧縮やプレビュー機能も提供。
 *
 * @param {Function} addTodo - 新しいToDoをリストに追加する関数
 * @param {Function} setShowCamera - カメラモーダルを表示する関数
 * @param {Function} openImageModal - 画像モーダルを開く関数
 * @param {string | null} capturedImageForNewTodo - 画像キャプチャ機能で取得した画像データ
 * @param {Function} clearCapturedImageForNewTodo - capturedImageForNewTodo をクリアする関数
 * @param {Array} groups - 利用可能なグループのリスト
 * @param {Function} addGroup - 新しいグループを追加する関数
 */

// デバイスのメモリに応じた画像の上限を設定
const getMaxImages = () => {
  if (navigator.deviceMemory) {
    // デバイスのメモリが利用可能な場合
    const memoryGB = navigator.deviceMemory;
    if (memoryGB >= 8) return 10; // 8GB以上: 10枚
    if (memoryGB >= 4) return 8;  // 4GB以上: 8枚
    if (memoryGB >= 2) return 5;  // 2GB以上: 5枚
    return 3; // 2GB未満: 3枚
  }
  // デバイスのメモリ情報が利用できない場合は、デフォルト値を使用
  return 5;
};

const TodoForm = ({ addTodo, groups, addGroup, setShowCamera, openImageModal }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState(3);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#6750A4');
  const [showNewGroupInputs, setShowNewGroupInputs] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [maxImages, setMaxImages] = useState(getMaxImages());

  // デバイスのメモリ情報が変更された場合に上限を更新
  useEffect(() => {
    const updateMaxImages = () => {
      setMaxImages(getMaxImages());
    };

    // メモリ情報の変更を監視
    if ('deviceMemory' in navigator) {
      window.addEventListener('resize', updateMaxImages);
      return () => window.removeEventListener('resize', updateMaxImages);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const dueDateTime = dueDate && dueTime ? `${dueDate}T${dueTime}` : null;

    addTodo({
      text: text.trim(),
      dueDateTime,
      priority,
      groupId: selectedGroupId === 'create_new_group' ? null : selectedGroupId,
      completed: false,
      images: selectedImages,
    });

    setText('');
    setDueDate('');
    setDueTime('');
    setPriority(3);
    setSelectedGroupId('');
    setNewGroupName('');
    setNewGroupColor('#6750A4');
    setShowNewGroupInputs(false);
    setSelectedImages([]);
    setImageError('');
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
    const remainingSlots = maxImages - selectedImages.length;

    if (files.length > remainingSlots) {
      setImageError(`画像は最大${maxImages}枚までです。残り${remainingSlots}枚まで追加できます。`);
      return;
    }

    setImageError('');

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
    console.log('Selected images:', newImages); // Debug log
    setSelectedImages([...selectedImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImageError('');
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="タスク"
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outlined"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              type="date"
              label="期限日"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
            <TextField
              type="time"
              label="期限時間"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>優先度</InputLabel>
            <Select
              value={priority}
              label="優先度"
              onChange={(e) => setPriority(Number(e.target.value))}
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

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddPhotoAlternateIcon />}
              component="label"
              sx={{ flex: 1 }}
              disabled={selectedImages.length >= maxImages}
            >
              画像を選択
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageSelect}
              />
            </Button>
            <Button
              variant="outlined"
              startIcon={<CameraAltIcon />}
              onClick={() => setShowCamera(true)}
              sx={{ flex: 1 }}
              disabled={selectedImages.length >= maxImages}
            >
              カメラ
            </Button>
          </Box>

          {imageError && (
            <Alert severity="warning" onClose={() => setImageError('')}>
              {imageError}
            </Alert>
          )}

          {selectedImages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                選択された画像 ({selectedImages.length}/{maxImages}):
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedImages.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`Selected ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'background.paper',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!text.trim()}
          >
            タスクを追加
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default TodoForm;
