import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import GrassIcon from '@mui/icons-material/Grass';
import HiveIcon from '@mui/icons-material/Hive';

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (theme) => {
    onThemeChange(theme);
    handleClose();
  };

  const getThemeIcon = (theme) => {
    switch (theme) {
      case 'light':
        return <Brightness7Icon />;
      case 'dark':
        return <Brightness4Icon />;
      case 'blue':
        return <WaterDropIcon />;
      case 'green':
        return <GrassIcon />;
      case 'beige':
        return <HiveIcon />;
      default:
        return <Brightness7Icon />;
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        sx={{
          position: 'relative',
          zIndex: 1000,
        }}
      >
        {getThemeIcon(currentTheme)}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleThemeChange('light')}>
          <ListItemIcon>
            <Brightness7Icon />
          </ListItemIcon>
          <ListItemText>ライト</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('dark')}>
          <ListItemIcon>
            <Brightness4Icon />
          </ListItemIcon>
          <ListItemText>ダーク</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('blue')}>
          <ListItemIcon>
            <WaterDropIcon />
          </ListItemIcon>
          <ListItemText>ブルー</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('green')}>
          <ListItemIcon>
            <GrassIcon />
          </ListItemIcon>
          <ListItemText>グリーン</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('beige')}>
          <ListItemIcon>
            <HiveIcon />
          </ListItemIcon>
          <ListItemText>ベージュ</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ThemeSelector; 