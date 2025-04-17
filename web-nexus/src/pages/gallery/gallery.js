import React from 'react';
import {Button, Box} from '@mui/material'
const Gallery = () => {
  const handleChange = () => {
    
  }
  return (
    <div>
      <Box>
        <input
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          id="camera-input"
          multiple
          type="file"
          onChange={handleChange}
        />
        <label htmlFor="camera-input">
          <Button variant="contained" component="span" startIcon={<PhotoCameraIcon />}>
            Take Picture
          </Button>
        </label>
      </Box>
    </div>
  );
}

export default Gallery;
