// import { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   Stack,
//   Button,
//   Typography,
//   Box,
//   IconButton,
//   Paper,
//   Divider,
// } from '@mui/material';
// import { useDropzone } from 'react-dropzone';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { toast } from 'react-toastify';
// import * as Yup from 'yup';

// import { IStepComponent } from './IStepComponent';
// import {
//   uploadThumbnail,
//   uploadGallery,
// } from '../../../services/ProductMediaService';

// type UpdateImagesValues = {
//   productId?: string;
//   userId?: string;
//   thumbnail?: File | null;
//   gallery?: File[];
// };

// const UpdateImagesStep: IStepComponent<UpdateImagesValues> = (props) => {
//   const { values, setFieldValue, isSubmitting } = props;

//   const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
//   const [previewGallery, setPreviewGallery] = useState<string[]>([]);
//   const pasteRef = useRef<HTMLDivElement>(null);

//   /** ✅ Handle drop for thumbnail */
//   const onThumbnailDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       if (acceptedFiles.length > 0) {
//         const file = acceptedFiles[0];
//         setFieldValue('thumbnail', file);
//         setPreviewThumbnail(URL.createObjectURL(file));
//       }
//     },
//     [setFieldValue],
//   );

//   const {
//     getRootProps: getThumbnailRootProps,
//     getInputProps: getThumbnailInputProps,
//     isDragActive: isThumbnailDragActive,
//   } = useDropzone({
//     onDrop: onThumbnailDrop,
//     accept: { 'image/*': [] },
//     multiple: false,
//   });

//   /** ✅ Handle drop for gallery */
//   const onGalleryDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const updatedFiles = [...(values.gallery || []), ...acceptedFiles];
//       setFieldValue('gallery', updatedFiles);
//       setPreviewGallery((prev) => [
//         ...prev,
//         ...acceptedFiles.map((f) => URL.createObjectURL(f)),
//       ]);
//     },
//     [values.gallery, setFieldValue],
//   );

//   const {
//     getRootProps: getGalleryRootProps,
//     getInputProps: getGalleryInputProps,
//     isDragActive: isGalleryDragActive,
//   } = useDropzone({
//     onDrop: onGalleryDrop,
//     accept: { 'image/*': [] },
//   });

//   /** ✅ Paste support (for gallery) */
//   useEffect(() => {
//     const handlePaste = (event: ClipboardEvent) => {
//       if (!pasteRef.current) return;
//       if (!pasteRef.current.contains(document.activeElement)) return;

//       const items = event.clipboardData?.items;
//       if (!items) return;

//       const files: File[] = [];
//       for (const item of items) {
//         if (item.kind === 'file') {
//           const file = item.getAsFile();
//           if (file) files.push(file);
//         }
//       }

//       if (files.length > 0) {
//         onGalleryDrop(files);
//         toast.info(`${files.length} image(s) pasted`);
//       }
//     };

//     document.addEventListener('paste', handlePaste);
//     return () => document.removeEventListener('paste', handlePaste);
//   }, [onGalleryDrop]);

//   const removeGalleryPreview = (index: number) => {
//     const updated = [...(values.gallery || [])];
//     updated.splice(index, 1);
//     setFieldValue('gallery', updated);
//     setPreviewGallery((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <Stack mt={3} spacing={3}>
//       {/* ===== THUMBNAIL SECTION ===== */}
//       <Typography variant="h6">Thumbnail</Typography>
//       <Paper
//         {...getThumbnailRootProps()}
//         variant="outlined"
//         sx={{
//           p: 3,
//           textAlign: 'center',
//           border: '2px dashed',
//           borderColor: isThumbnailDragActive ? 'primary.main' : 'grey.400',
//           bgcolor: isThumbnailDragActive ? 'action.hover' : 'transparent',
//           cursor: 'pointer',
//         }}
//       >
//         <input {...getThumbnailInputProps()} />
//         <Typography>
//           {isThumbnailDragActive
//             ? 'Drop thumbnail here...'
//             : previewThumbnail
//               ? 'Click or drag to replace thumbnail'
//               : 'Drag & drop a thumbnail image, or click to browse'}
//         </Typography>
//       </Paper>

//       {previewThumbnail && (
//         <Box mt={1} display="flex" alignItems="center" gap={2}>
//           <img
//             src={previewThumbnail}
//             alt="Thumbnail Preview"
//             style={{
//               width: 140,
//               height: 140,
//               objectFit: 'cover',
//               borderRadius: 8,
//               border: '1px solid #ddd',
//             }}
//           />
//           <IconButton
//             color="error"
//             onClick={() => {
//               setFieldValue('thumbnail', null);
//               setPreviewThumbnail(null);
//             }}
//           >
//             <DeleteIcon />
//           </IconButton>
//         </Box>
//       )}

//       <Divider sx={{ my: 2 }} />

//       {/* ===== GALLERY SECTION ===== */}
//       <Typography variant="h6">Gallery</Typography>
//       <Paper
//         {...getGalleryRootProps()}
//         ref={pasteRef}
//         variant="outlined"
//         sx={{
//           p: 3,
//           textAlign: 'center',
//           border: '2px dashed',
//           borderColor: isGalleryDragActive ? 'primary.main' : 'grey.400',
//           bgcolor: isGalleryDragActive ? 'action.hover' : 'transparent',
//           cursor: 'pointer',
//         }}
//       >
//         <input {...getGalleryInputProps()} />
//         <Typography>
//           {isGalleryDragActive
//             ? 'Drop gallery images here...'
//             : 'Drag & drop gallery images, click to browse, or paste (Ctrl+V)'}
//         </Typography>
//       </Paper>

//       <Box mt={1} display="flex" gap={1} flexWrap="wrap">
//         {previewGallery.map((src, index) => (
//           <Box key={index} position="relative">
//             <img
//               src={src}
//               alt={`Gallery ${index}`}
//               style={{
//                 width: 100,
//                 height: 100,
//                 objectFit: 'cover',
//                 borderRadius: 6,
//                 border: '1px solid #ddd',
//               }}
//             />
//             <IconButton
//               size="small"
//               color="error"
//               onClick={() => removeGalleryPreview(index)}
//               sx={{
//                 position: 'absolute',
//                 top: 0,
//                 right: 0,
//                 backgroundColor: 'rgba(255,255,255,0.7)',
//               }}
//             >
//               <DeleteIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         ))}
//       </Box>

//       <Button
//         variant="contained"
//         type="submit"
//         disabled={isSubmitting}
//         sx={{ alignSelf: 'flex-start' }}
//       >
//         Save Images
//       </Button>
//     </Stack>
//   );
// };

// UpdateImagesStep.label = 'Cập nhật hình ảnh';

// UpdateImagesStep.initialValues = {
//   productId: '',
//   userId: '',
//   thumbnail: null,
//   gallery: [],
// };

// UpdateImagesStep.validationSchema = Yup.object({
//   productId: Yup.string().required('Missing productId'),
//   userId: Yup.string().required('Missing userId'),
// });

// UpdateImagesStep.onNextStep = async (values) => {
//   if (!values.productId) {
//     toast.error('Reload page and try again');
//     return;
//   }
//   if (!values.userId) {
//     toast.error('User id không tồn tại, vui lòng đăng nhập lại');
//     return;
//   }

//   try {
//     if (values.thumbnail) {
//       await uploadThumbnail(values.productId, values.thumbnail);
//       toast.success('Thumbnail uploaded successfully');
//     }
//     if (values.gallery && values.gallery.length > 0) {
//       await uploadGallery(values.productId, values.gallery);
//       toast.success('Gallery uploaded successfully');
//     }
//   } catch (err: any) {
//     toast.error(err.message || 'Failed to upload images');
//   }
// };

// UpdateImagesStep.visited = false;

// export default UpdateImagesStep;
