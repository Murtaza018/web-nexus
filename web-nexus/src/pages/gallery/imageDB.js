// imageDB.js
const DB_NAME = "image_gallery_db"
const DB_VERSION = 2 // Increased version for schema update
const IMAGES_STORE = "images"

let db = null

export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error("Database error:", event.target.error)
      reject(event.target.error)
    }

    request.onsuccess = (event) => {
      db = event.target.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Create or update images store with albumId index
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        const imagesStore = db.createObjectStore(IMAGES_STORE, { keyPath: "id", autoIncrement: true })
        imagesStore.createIndex("albumId", "albumId", { unique: false })
      } else {
        // Check if albumId index exists, if not create it
        const transaction = event.target.transaction
        const store = transaction.objectStore(IMAGES_STORE)
        if (!store.indexNames.contains("albumId")) {
          store.createIndex("albumId", "albumId", { unique: false })
        }
      }
    }
  })
}

export const saveImagesToIndexedDB = (files, albumId = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB()

      const transaction = db.transaction(IMAGES_STORE, "readwrite")
      const objectStore = transaction.objectStore(IMAGES_STORE)

      let counter = 0
      const totalFiles = files.length

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i]
        const image = {
          file: file,
          name: file.name,
          timestamp: Date.now(),
          albumId: albumId,
        }

        const request = objectStore.add(image)

        request.onsuccess = () => {
          counter++
          if (counter === totalFiles) {
            resolve(true)
          }
        }

        request.onerror = (event) => {
          console.error("Error adding image:", event.target.error)
          reject(event.target.error)
        }
      }

      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error)
        reject(event.target.error)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export const getImagesFromIndexedDB = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB()

      const transaction = db.transaction(IMAGES_STORE, "readonly")
      const objectStore = transaction.objectStore(IMAGES_STORE)
      const request = objectStore.getAll()

      request.onsuccess = (event) => {
        resolve(event.target.result)
      }

      request.onerror = (event) => {
        console.error("Error getting images:", event.target.error)
        reject(event.target.error)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export const clearImagesFromIndexedDB = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB()

      const transaction = db.transaction(IMAGES_STORE, "readwrite")
      const objectStore = transaction.objectStore(IMAGES_STORE)
      const request = objectStore.clear()

      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = (event) => {
        console.error("Error clearing images:", event.target.error)
        reject(event.target.error)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export const assignImageToAlbum = (imageId, albumId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initDB()

      const transaction = db.transaction(IMAGES_STORE, "readwrite")
      const objectStore = transaction.objectStore(IMAGES_STORE)
      const getRequest = objectStore.get(imageId)

      getRequest.onsuccess = (event) => {
        const image = event.target.result
        if (image) {
          image.albumId = albumId
          const updateRequest = objectStore.put(image)

          updateRequest.onsuccess = () => {
            resolve(true)
          }

          updateRequest.onerror = (event) => {
            console.error("Error updating image:", event.target.error)
            reject(event.target.error)
          }
        } else {
          reject(new Error("Image not found"))
        }
      }

      getRequest.onerror = (event) => {
        console.error("Error getting image:", event.target.error)
        reject(event.target.error)
      }
    } catch (error) {
      reject(error)
    }
  })
}
