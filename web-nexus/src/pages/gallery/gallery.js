"use client"

import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from "@mui/material"
import {
  ChevronLeft,
  ChevronRight,
  Close,
  Slideshow as SlideshowIcon,
  PlayCircle,
  PauseCircle,
  Photo,
  PhotoAlbum,
  MoreVert,
} from "@mui/icons-material"
import { initDB, saveImagesToIndexedDB, getImagesFromIndexedDB, clearImagesFromIndexedDB, assignImageToAlbum } from "./imageDB"

// Hardcoded albums
const ALBUMS = [
  { id: "family", name: "Family Photos" },
  { id: "vacation", name: "Vacation" },
  { id: "pets", name: "Pets" },
  { id: "events", name: "Events" },
  { id: "food", name: "Food" },
]

const Gallery = () => {
  const [images, setImages] = useState([])
  const [uploadedImages, setUploadedImages] = useState(null)
  const [imageUrls, setImageUrls] = useState({})
  const [slideshowOpen, setSlideshowOpen] = useState(false)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  // Album state
  const [selectedAlbum, setSelectedAlbum] = useState("")
  const [imageMenuAnchorEl, setImageMenuAnchorEl] = useState(null)
  const [selectedImageForMenu, setSelectedImageForMenu] = useState(null)

  const familyMembers = [
    "Mom",
    "Dad",
    "Jake",
    "Emma",
    "Grandma",
    "Grandpa",
    "aneeq",
  ];

  const [currentUser, setCurrentUser] = useState({
    firstname: "Dad",
    lastname: "Raza",
    username: "araza-29",
    password: "aloomian",
  });

  useEffect(() => {
    const loadImages = async () => {
      try {
        await initDB()
        const fetchedImagesData = await getImagesFromIndexedDB()

        // Filter images by album if an album is selected
        if(selectedAlbum === "family") {
          if (familyMembers.includes(currentUser.firstname)){
            const filteredImages = fetchedImagesData.filter((img) => img.albumId === selectedAlbum)
            setImages(filteredImages || [])
          }
          else {
            setImages([])
          }
        }
        else if (selectedAlbum) {
          const filteredImages = fetchedImagesData.filter((img) => img.albumId === selectedAlbum)
          setImages(filteredImages || [])
        } else {
          setImages(fetchedImagesData || [])
        }
      } catch (error) {
        console.error("Error loading images:", error)
      }
    }

    loadImages()
  }, [selectedAlbum])

  useEffect(() => {
    const newUrls = {}
    let urlsCreated = false

    images.forEach((image) => {
      if (image && image.file instanceof Blob) {
        newUrls[image.id] = URL.createObjectURL(image.file)
        urlsCreated = true
      }
    })

    if (urlsCreated) {
      setImageUrls((prevUrls) => ({ ...prevUrls, ...newUrls }))
    }

    return () => {
      Object.values(newUrls).forEach((url) => URL.revokeObjectURL(url))
    }
  }, [images])

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedImages(e.target.files)
    }
  }

  const handleUploadImage = async () => {
    if (!uploadedImages) return

    try {
      // Save images with album ID if an album is selected
      await saveImagesToIndexedDB(uploadedImages, selectedAlbum || null)

      // Refresh images based on current album selection
      const updatedImages = await getImagesFromIndexedDB()
      if (selectedAlbum) {
        const filteredImages = updatedImages.filter((img) => img.albumId === selectedAlbum)
        setImages(filteredImages || [])
      } else {
        setImages(updatedImages || [])
      }

      setUploadedImages(null)

      const fileInput = document.getElementById("camera-input")
      if (fileInput) fileInput.value = ""
      toast.success('Files uploaded successfully!')
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error('Files not uploaded!')
    }
  }

  const handleClearGallery = async () => {
    try {
      await clearImagesFromIndexedDB()
      setImages([])
      setImageUrls({})
    } catch (error) {
      console.error("Error clearing gallery:", error)
    }
  }

  // Album functions
  const handleAlbumChange = (event) => {
    setSelectedAlbum(event.target.value)
  }

  const handleAssignToAlbum = async (imageId, albumId) => {
    try {
      await assignImageToAlbum(imageId, albumId)
      
      // Refresh images based on current album selection
      const updatedImages = await getImagesFromIndexedDB()
      if (selectedAlbum) {
        const filteredImages = updatedImages.filter((img) => img.albumId === selectedAlbum)
        setImages(filteredImages || [])
      } else {
        setImages(updatedImages || [])
      }

      setImageMenuAnchorEl(null)
    } catch (error) {
      console.error("Error assigning image to album:", error)
    }
  }

  // Slideshow functions
  const openSlideshow = (startIndex = 0) => {
    if (images.length > 0) {
      setCurrentSlideIndex(startIndex)
      setSlideshowOpen(true)
      setAutoPlay(true) // Enable auto-play when slideshow opens
    }
  }

  const closeSlideshow = () => {
    setSlideshowOpen(false)
  }

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const goToPrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const toggleAutoPlay = () => {
    setAutoPlay((prev) => !prev)
  }

  // Handle keyboard navigation in slideshow
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!slideshowOpen) return

      if (e.key === "ArrowRight") {
        goToNextSlide()
      } else if (e.key === "ArrowLeft") {
        goToPrevSlide()
      } else if (e.key === "Escape") {
        closeSlideshow()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [slideshowOpen])

  // Auto-play functionality
  useEffect(() => {
    let intervalId

    if (slideshowOpen && autoPlay && images.length > 1) {
      intervalId = setInterval(() => {
        goToNextSlide()
      }, 2000) // Change slide every 2 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [slideshowOpen, autoPlay, images.length])

  // Image menu handlers
  const handleImageMenuOpen = (event, image) => {
    event.stopPropagation()
    setImageMenuAnchorEl(event.currentTarget)
    setSelectedImageForMenu(image)
  }

  const handleImageMenuClose = () => {
    setImageMenuAnchorEl(null)
    setSelectedImageForMenu(null)
  }

  // Get current album name
  const getCurrentAlbumName = () => {
    if (!selectedAlbum) return "All Photos"
    const album = ALBUMS.find((a) => a.id === selectedAlbum)
    return album ? album.name : "Unknown Album"
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with album dropdown */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Photo Gallery
        </Typography>
        
        {/* Album dropdown */}
        <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
          <InputLabel id="album-select-label">Select Album</InputLabel>
          <Select
            labelId="album-select-label"
            id="album-select"
            value={selectedAlbum}
            onChange={handleAlbumChange}
            label="Select Album"
          >
            <MenuItem value="">
              <ListItemIcon>
                <Photo />
              </ListItemIcon>
              <ListItemText>All Photos</ListItemText>
            </MenuItem>
            <Divider />
            {ALBUMS.map((album) => (
              <MenuItem key={album.id} value={album.id}>
                <ListItemIcon>
                  <PhotoAlbum />
                </ListItemIcon>
                <ListItemText>{album.name}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <input
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          id="camera-input"
          multiple
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="camera-input">
          <Button
            variant="contained"
            component="span"
            sx={{ backgroundColor: "#387478", "&:hover": { backgroundColor: "#2f5f61" }, color: "#fff" }}
          >
            Take Picture
          </Button>
        </label>
        {uploadedImages && (
          <Button
            variant="contained"
            onClick={handleUploadImage}
            sx={{ backgroundColor: "#387478", "&:hover": { backgroundColor: "#2f5f61" }, color: "#fff" }}
          >
            Upload {uploadedImages.length} Image{uploadedImages.length > 1 ? "s" : ""}
            {selectedAlbum && ` to ${getCurrentAlbumName()}`}
          </Button>
        )}

        {/* Slideshow Button */}
        {images.length > 0 && (
          <Button variant="outlined" color="primary" onClick={() => openSlideshow(0)} startIcon={<SlideshowIcon />}>
            Start Slideshow
          </Button>
        )}

        {/* Optional Clear Button */}
        {images.length > 0 && (
          <Button variant="outlined" color="error" onClick={handleClearGallery}>
            Clear Gallery
          </Button>
        )}
      </Box>

      {uploadedImages && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            {uploadedImages.length} image{uploadedImages.length > 1 ? "s" : ""} selected for upload
            {selectedAlbum && <span> to album: {getCurrentAlbumName()}</span>}
          </Typography>
        </Box>
      )}

      {/* Album indicator */}
      {selectedAlbum && (
        <Chip 
          label={`Album: ${getCurrentAlbumName()}`} 
          onDelete={() => setSelectedAlbum("")} 
          sx={{ mb: 2 }} 
        />
      )}

      {/* --- Scrollable Horizontal Image Row --- */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          py: 2,
          px: 1,
          justifyContent: "flex-start",
        }}
      >
        {images && images.length > 0 ? (
          images.map((image, index) => {
            const imageUrl = imageUrls[image.id]

            return (
              <Box
                key={image.id}
                sx={{
                  width: 180,
                  height: 180,
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 2,
                  border: "1px solid #ddd",
                  backgroundColor: "#fefefe",
                  transition: "transform 0.2s ease",
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => openSlideshow(index)}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Gallery image ${image.name || image.id}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      console.error(`Image failed to load: ID ${image.id}, URL ${imageUrl}`)
                      e.target.style.display = "none"
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "text.secondary",
                      textAlign: "center",
                      lineHeight: "180px",
                    }}
                  >
                    {image.file ? "Loading..." : "Invalid"}
                  </Typography>
                )}

                {/* Image menu button */}
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                    },
                  }}
                  onClick={(e) => handleImageMenuOpen(e, image)}
                >
                  <MoreVert fontSize="small" />
                </IconButton>
                
                {/* Album indicator on image */}
                {image.albumId && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      padding: "2px 8px",
                      fontSize: "0.7rem",
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ALBUMS.find(a => a.id === image.albumId)?.name || "Album"}
                  </Box>
                )}
              </Box>
            )
          })
        ) : (
          <Typography color="text.secondary" sx={{ mx: "auto" }}>
            {selectedAlbum
              ? "No images in this album. Take some pictures to add to this album."
              : "No images available. Take some pictures to add to your gallery."}
          </Typography>
        )}
      </Box>

      {/* Slideshow Dialog */}
      <Dialog
        open={slideshowOpen}
        onClose={closeSlideshow}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.9)",
            boxShadow: "none",
            position: "relative",
            height: "90vh",
          },
        }}
      >
        <IconButton
          onClick={closeSlideshow}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            zIndex: 1,
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 0, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
          {images.length > 0 && (
            <>
              <IconButton
                onClick={goToPrevSlide}
                sx={{
                  position: "absolute",
                  left: 16,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  },
                }}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>

              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {images[currentSlideIndex] && imageUrls[images[currentSlideIndex].id] ? (
                  <img
                    src={imageUrls[images[currentSlideIndex].id] || "/placeholder.svg"}
                    alt={`Slideshow image ${currentSlideIndex + 1}`}
                    style={{
                      maxHeight: "90%",
                      maxWidth: "90%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Typography color="white">Image not available</Typography>
                )}
              </Box>

              <IconButton
                onClick={goToNextSlide}
                sx={{
                  position: "absolute",
                  right: 16,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  },
                }}
              >
                <ChevronRight fontSize="large" />
              </IconButton>

              <Typography
                sx={{
                  position: "absolute",
                  bottom: 16,
                  color: "white",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                {currentSlideIndex + 1} / {images.length}
              </Typography>

              <IconButton
                onClick={toggleAutoPlay}
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  color: "white",
                  backgroundColor: autoPlay ? "rgba(0, 128, 0, 0.5)" : "rgba(0, 0, 0, 0.5)",
                  "&:hover": {
                    backgroundColor: autoPlay ? "rgba(0, 128, 0, 0.7)" : "rgba(0, 0, 0, 0.7)",
                  },
                }}
              >
                {autoPlay ? <PauseCircle /> : <PlayCircle />}
              </IconButton>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Menu */}
      <Menu anchorEl={imageMenuAnchorEl} open={Boolean(imageMenuAnchorEl)} onClose={handleImageMenuClose}>
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            Add to Album
          </Typography>
        </MenuItem>
        <Divider />
        {ALBUMS.map((album) => (
          <MenuItem
            key={album.id}
            onClick={() => {handleAssignToAlbum(selectedImageForMenu?.id, album.id); toast.success('Album assigned successfully!')}}
            selected={selectedImageForMenu?.albumId === album.id}
          >
            <ListItemIcon>
              <PhotoAlbum fontSize="small" />
            </ListItemIcon>
            <ListItemText>{album.name}</ListItemText>
          </MenuItem>
        ))}
        {selectedImageForMenu?.albumId && (
          <MenuItem onClick={() => {handleAssignToAlbum(selectedImageForMenu?.id, null); toast.success('Removed from album!')}}>
            <ListItemText>Remove from Album</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}

export default Gallery
