import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Image as ImageIcon, Video, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProjectUploadTile({ onUpload, category }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [fileType, setFileType] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleFile(files[0])
    }
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      await handleFile(files[0])
    }
  }

  const handleFile = async (file) => {
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      alert('Please upload an image or video file')
      return
    }

    setFileType(isImage ? 'image' : 'video')
    setUploading(true)

    if (isImage) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }

    // upload file
    try {
      const { ApiClient } = await import('@/lib/api-client')
      const apiClient = new ApiClient()
      
      const response = await apiClient.uploadFile(file, category)
      
      if (response.success) {
        if (onUpload) {
          onUpload({
            url: response.data.url,
            type: isImage ? 'image' : 'video',
            filename: file.name
          })
        }
      } else {
        throw new Error(response.message || 'Upload failed')
      }

      setPreview(null)
      setFileType(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const clearPreview = () => {
    setPreview(null)
    setFileType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card
      className={`bg-card/30 backdrop-blur-xl border-2 border-dashed transition-all duration-300 h-full ${
        isDragging
          ? 'border-primary/50 bg-primary/10 scale-105'
          : 'border-border/50 hover:border-primary/30'
      } ${uploading ? 'opacity-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !uploading && !preview && fileInputRef.current?.click()}
    >
      <div className="relative overflow-hidden h-48 bg-gradient-to-br from-background/50 to-background/30 flex items-center justify-center">
        {preview ? (
          <>
            {fileType === 'image' ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-primary">
                <Video className="w-12 h-12 mb-2" />
                <p className="text-sm">Video uploaded</p>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearPreview()
              }}
              className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : uploading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">Drop file here</p>
            <p className="text-xs text-muted-foreground">or click to browse</p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Image or Video
            </p>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg text-center">
          {preview ? 'Upload Complete' : 'Add New Project'}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-xs text-muted-foreground">
          {preview ? 'Click to add another' : 'Drag & drop or click to upload'}
        </p>
      </CardContent>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </Card>
  )
}
