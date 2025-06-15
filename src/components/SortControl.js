import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const SortControl = ({ sortBy, sortOrder, onSortByChange, onSortOrderChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>並び替え</InputLabel>
        <Select
          value={sortBy}
          label="並び替え"
          onChange={(e) => onSortByChange(e.target.value)}
          startAdornment={<SortIcon sx={{ mr: 1, fontSize: '1.2rem' }} />}
        >
          <MenuItem value="created">作成日時</MenuItem>
          <MenuItem value="due">期限</MenuItem>
          <MenuItem value="completed">完了状態</MenuItem>
          <MenuItem value="name">タスク名</MenuItem>
          <MenuItem value="priority">優先度</MenuItem>
        </Select>
      </FormControl>

      <IconButton
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        color="primary"
        size="small"
      >
        {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      </IconButton>
    </Box>
  );
};

export default SortControl; 