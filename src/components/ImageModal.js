import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ImageModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'black',
          }}
        >
          <Box
            component="img"
            src={image}
            alt="拡大表示"
            sx={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
