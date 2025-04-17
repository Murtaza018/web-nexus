"use client"

import { useState, useEffect } from "react"
import { Button, Box, Typography, Dialog, DialogContent, IconButton } from "@mui/material"
import {
  ChevronLeft,
  ChevronRight,
  Close,
  Slideshow as SlideshowIcon,
  PlayCircle,
  PauseCircle,
} from "@mui/icons-material"
import { initDB, saveImagesToIndexedDB, getImagesFromIndexedDB, clearImagesFromIndexedDB } from "./imageDB" // Assuming this file manages IndexedDB logic

const Gallery = () => {
  const [images, setImages] = useState([])
  const [uploadedImages, setUploadedImages] = useState(null)
  const [imageUrls, setImageUrls] = useState({})
  const [slideshowOpen, setSlideshowOpen] = useState(false)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  // Add a new state variable for auto-play after the other state variables
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      try {
        await initDB()
        const fetchedImagesData = await getImagesFromIndexedDB()
        setImages(fetchedImagesData || [])
      } catch (error) {
        console.error("Error loading images:", error)
      }
    }

    loadImages()
  }, [])

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
      await saveImagesToIndexedDB(uploadedImages)
      const updatedImages = await getImagesFromIndexedDB()
      setImages(updatedImages || [])
      setUploadedImages(null)

      const fileInput = document.getElementById("camera-input")
      if (fileInput) fileInput.value = ""
    } catch (error) {
      console.error("Error uploading images:", error)
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

  // Slideshow functions
  // Modify the openSlideshow function to start auto-play by default
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

  // Add a toggleAutoPlay function after the goToPrevSlide function
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

  // Add this useEffect for auto-play functionality after the keyboard navigation useEffect
  useEffect(() => {
    let intervalId

    if (slideshowOpen && autoPlay && images.length > 1) {
      intervalId = setInterval(() => {
        goToNextSlide()
      }, 2000) // Change slide every 1 second
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [slideshowOpen, autoPlay, images.length])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Photo Gallery
      </Typography>

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
          <Button variant="contained" component="span" sx={{backgroundColor: '#387478','&:hover': {backgroundColor: '#2f5f61'},color: '#fff'}}>
            Take Picture
          </Button>
        </label>
        {uploadedImages && (
          <Button variant="contained" onClick={handleUploadImage} sx={{backgroundColor: '#387478','&:hover': {backgroundColor: '#2f5f61'},color: '#fff'}}>
            Upload {uploadedImages.length} Image{uploadedImages.length > 1 ? "s" : ""}
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
          </Typography>
        </Box>
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
              </Box>
            )
          })
        ) : (
          <Typography color="text.secondary" sx={{ mx: "auto" }}>
            No images available. Take some pictures to add to your gallery.
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
              {/* Add an auto-play toggle button in the slideshow dialog after the image counter Typography */}
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
    </Box>
  )
}

export default Gallery
