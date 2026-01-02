/**
 * Step 2: Media Upload
 * Thumbnail and gallery images with drag-and-drop
 * Supports displaying and deleting existing images
 */
import { useCallback, useState, useRef, useEffect, memo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  alpha,
  LinearProgress,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import type { ProductImageDto } from '../../../../services/interfaces/productTypes';

export interface ExistingImage {
  id: string;
  url: string;
  sortOrder?: number;
}

interface MediaUploadStepProps {
  data: {
    thumbnail: File | null;
    gallery: File[];
  };
  onChange: (updates: Partial<MediaUploadStepProps['data']>) => void;
  // Props for existing images (edit mode)
  existingThumbnailUrl?: string | null;
  existingImages?: ProductImageDto[];
  productId?: string;
  onDeleteThumbnail?: () => Promise<void>;
  onDeleteImage?: (imageId: string) => Promise<void>;
}

const MediaUploadStep = memo(function MediaUploadStep({
  data,
  onChange,
  existingThumbnailUrl,
  existingImages = [],
  // productId is available for future use if needed
  onDeleteThumbnail,
  onDeleteImage,
}: MediaUploadStepProps) {
  const theme = useTheme();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [localExistingImages, setLocalExistingImages] = useState<ProductImageDto[]>(existingImages);
  const [localExistingThumbnail, setLocalExistingThumbnail] = useState<string | null>(
    existingThumbnailUrl || null,
  );
  const [deletingThumbnail, setDeletingThumbnail] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const pasteRef = useRef<HTMLDivElement>(null);

  // Update local state when props change
  useEffect(() => {
    setLocalExistingImages(existingImages);
  }, [existingImages]);

  useEffect(() => {
    setLocalExistingThumbnail(existingThumbnailUrl || null);
  }, [existingThumbnailUrl]);

  // Generate preview URLs for new files
  useEffect(() => {
    if (data.thumbnail) {
      const url = URL.createObjectURL(data.thumbnail);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setThumbnailPreview(null);
    }
  }, [data.thumbnail]);

  useEffect(() => {
    const urls = data.gallery.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [data.gallery]);

  // Thumbnail dropzone
  const onThumbnailDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onChange({ thumbnail: acceptedFiles[0] });
        toast.success('Thumbnail added');
      }
    },
    [onChange],
  );

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
    isDragActive: isThumbnailDragActive,
  } = useDropzone({
    onDrop: onThumbnailDrop,
    accept: { 'image/*': [] },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

  // Gallery dropzone
  const onGalleryDrop = useCallback(
    (acceptedFiles: File[]) => {
      const totalImages = data.gallery.length + localExistingImages.length + acceptedFiles.length;
      const available = 8 - localExistingImages.length;
      const newFiles = [...data.gallery, ...acceptedFiles].slice(0, available);
      onChange({ gallery: newFiles });
      if (acceptedFiles.length > 0) {
        toast.success(`${Math.min(acceptedFiles.length, available)} image(s) added`);
      }
      if (totalImages > 8) {
        toast.warning('Maximum 8 gallery images allowed');
      }
    },
    [data.gallery, localExistingImages.length, onChange],
  );

  const {
    getRootProps: getGalleryRootProps,
    getInputProps: getGalleryInputProps,
    isDragActive: isGalleryDragActive,
  } = useDropzone({
    onDrop: onGalleryDrop,
    accept: { 'image/*': [] },
    maxSize: 5 * 1024 * 1024,
  });

  // Paste support
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (!pasteRef.current?.contains(document.activeElement)) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        const available = 8 - localExistingImages.length;
        const newFiles = [...data.gallery, ...files].slice(0, available);
        onChange({ gallery: newFiles });
        toast.info(`${Math.min(files.length, available)} image(s) pasted`);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [data.gallery, localExistingImages.length, onChange]);

  // Remove new thumbnail (not yet uploaded)
  const removeNewThumbnail = () => onChange({ thumbnail: null });

  // Delete existing thumbnail from server
  const handleDeleteExistingThumbnail = async () => {
    if (!onDeleteThumbnail) return;
    try {
      setDeletingThumbnail(true);
      await onDeleteThumbnail();
      setLocalExistingThumbnail(null);
      toast.success('Thumbnail deleted');
    } catch (error) {
      toast.error('Failed to delete thumbnail');
    } finally {
      setDeletingThumbnail(false);
    }
  };

  // Remove new gallery image (not yet uploaded)
  const removeNewGalleryImage = (index: number) => {
    const newGallery = data.gallery.filter((_, i) => i !== index);
    onChange({ gallery: newGallery });
  };

  // Delete existing gallery image from server
  const handleDeleteExistingImage = async (imageId: string) => {
    if (!onDeleteImage) return;
    try {
      setDeletingImageId(imageId);
      await onDeleteImage(imageId);
      setLocalExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success('Image deleted');
    } catch (error) {
      toast.error('Failed to delete image');
    } finally {
      setDeletingImageId(null);
    }
  };

  const totalGalleryCount = localExistingImages.length + data.gallery.length;

  return (
    <Box ref={pasteRef} tabIndex={0} sx={{ maxWidth: 900, mx: 'auto', outline: 'none' }}>
      <Grid container spacing={2}>
        {/* Thumbnail Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Thumbnail
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Main product image
            </Typography>

            {/* Show new thumbnail preview */}
            {thumbnailPreview ? (
              <Box sx={{ position: 'relative' }}>
                <Chip
                  label="New"
                  size="small"
                  color="primary"
                  sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
                />
                <Box
                  component="img"
                  src={thumbnailPreview}
                  alt="Thumbnail"
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
                <IconButton
                  onClick={removeNewThumbnail}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { bgcolor: 'error.light', color: 'white' },
                  }}
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : localExistingThumbnail ? (
              /* Show existing thumbnail */
              <Box sx={{ position: 'relative' }}>
                <Chip
                  label="Current"
                  size="small"
                  color="default"
                  sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
                />
                <Box
                  component="img"
                  src={localExistingThumbnail}
                  alt="Current Thumbnail"
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
                <IconButton
                  onClick={handleDeleteExistingThumbnail}
                  disabled={deletingThumbnail}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { bgcolor: 'error.light', color: 'white' },
                  }}
                  size="small"
                >
                  {deletingThumbnail ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CloseIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
            ) : (
              /* Upload dropzone */
              <Paper
                {...getThumbnailRootProps()}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: `1px dashed ${isThumbnailDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 1,
                  bgcolor: isThumbnailDragActive ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                  cursor: 'pointer',
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <input {...getThumbnailInputProps()} />
                <Typography variant="body2" fontWeight={500}>
                  {isThumbnailDragActive ? 'Drop here' : 'Upload Image'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  800×800px • Max 5MB
                </Typography>
              </Paper>
            )}
          </Paper>
        </Grid>

        {/* Gallery Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Gallery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalGalleryCount}/8
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Additional product images
            </Typography>

            {totalGalleryCount < 8 && (
              <Paper
                {...getGalleryRootProps()}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  border: `1px dashed ${isGalleryDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 1,
                  bgcolor: isGalleryDragActive ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                  cursor: 'pointer',
                  mb: 2,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <input {...getGalleryInputProps()} />
                <Typography variant="body2" fontWeight={500}>
                  {isGalleryDragActive ? 'Drop images here' : 'Add Images'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Drag & drop, click, or paste (Ctrl+V)
                </Typography>
              </Paper>
            )}

            {/* Progress bar */}
            <LinearProgress
              variant="determinate"
              value={(totalGalleryCount / 8) * 100}
              sx={{
                height: 4,
                borderRadius: 1,
                mb: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            />

            {/* Gallery grid */}
            {(localExistingImages.length > 0 || galleryPreviews.length > 0) && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 1,
                }}
              >
                {/* Existing images first */}
                {localExistingImages.map((image) => (
                  <Box
                    key={image.id}
                    sx={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Chip
                      label="Current"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        zIndex: 1,
                        height: 20,
                        fontSize: '0.65rem',
                      }}
                    />
                    <Box
                      component="img"
                      src={image.url}
                      alt={`Gallery image`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      onClick={() => handleDeleteExistingImage(image.id)}
                      disabled={deletingImageId === image.id}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'background.paper',
                        padding: 0.5,
                        boxShadow: 1,
                        '&:hover': { bgcolor: 'error.light', color: 'white' },
                      }}
                      size="small"
                    >
                      {deletingImageId === image.id ? (
                        <CircularProgress size={12} />
                      ) : (
                        <CloseIcon sx={{ fontSize: 14 }} />
                      )}
                    </IconButton>
                  </Box>
                ))}

                {/* New images */}
                {galleryPreviews.map((src, index) => (
                  <Box
                    key={`new-${index}`}
                    sx={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Chip
                      label="New"
                      size="small"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        zIndex: 1,
                        height: 20,
                        fontSize: '0.65rem',
                      }}
                    />
                    <Box
                      component="img"
                      src={src}
                      alt={`Gallery ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      onClick={() => removeNewGalleryImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'background.paper',
                        padding: 0.5,
                        boxShadow: 1,
                        '&:hover': { bgcolor: 'error.light', color: 'white' },
                      }}
                      size="small"
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Tips */}
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.info.main, 0.05),
          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Use high-resolution images (800×800px minimum). Show multiple angles and close-ups.
        </Typography>
      </Paper>
    </Box>
  );
});

export default MediaUploadStep;
