// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// import {
//     Container,
//     Box,
//     Typography,
//     Button,
//     CircularProgress,
//     Grid,
//     Card,
//     CardMedia,
//     Skeleton,
//     Dialog,
//     DialogContent,
//     IconButton,

// } from '@mui/material';
// import DownloadIcon from '@mui/icons-material/Download';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import CloseIcon from '@mui/icons-material/Close';
// import ZoomInIcon from '@mui/icons-material/ZoomIn';
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'; // Add this import

// export default function EventGallery() {
//     const { eventId } = useParams();
//     const navigate = useNavigate();
//     const [photos, setPhotos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [eventInfo, setEventInfo] = useState(null);
//     const [loadedThumbnails, setLoadedThumbnails] = useState({});
//     const [loadedFullImages, setLoadedFullImages] = useState({});
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [scrollPosition, setScrollPosition] = useState(0); // Add for scroll position
//     const [showBackToTop, setShowBackToTop] = useState(false); // Add for back to top button
//     const imageRefs = useRef({});

//     const eventMap = {
//         1: {
//             title: "Pre-Wedding",
//             endpoint: "http://127.0.0.1:8000/gallery/images/?category=pre_wedding",
//             color: "#ff4081"
//         },
//         2: {
//             title: "Mehndi Night",
//             endpoint: "http://127.0.0.1:8000/gallery/images/?category=mehndi",
//             color: "#7c4dff"
//         },
//         3: {
//             title: "Haldi Ceremony",
//             endpoint: "http://127.0.0.1:8000/gallery/images/?category=haldi",
//             color: "#00bcd4"
//         },
//         4: {
//             title: "Sagan Ceremony",
//             endpoint: "http://127.0.0.1:8000/gallery/images/?category=sagan",
//             color: "#ff9100"
//         },
//         5: {
//             title: "Wedding Day",
//             endpoint: "http://127.0.0.1:8000/gallery/images/?category=wedding",
//             color: "#ff1744"
//         }
//     };

//     useEffect(() => {
//         fetchGalleryData();
//     }, [eventId]);

//     // Add scroll listener for Back to Top button
//     useEffect(() => {
//         const handleScroll = () => {
//             setShowBackToTop(window.pageYOffset > 400);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     // Add popstate listener for browser back button
//     useEffect(() => {
//         const handlePopState = () => {
//             // Restore scroll position when user comes back via browser back button
//             setTimeout(() => {
//                 window.scrollTo({
//                     top: scrollPosition,
//                     behavior: 'smooth'
//                 });
//             }, 100);
//         };

//         window.addEventListener('popstate', handlePopState);
//         return () => window.removeEventListener('popstate', handlePopState);
//     }, [scrollPosition]);

//     const fetchGalleryData = async () => {
//         try {
//             setLoading(true);
//             const event = eventMap[eventId];
//             setEventInfo(event);

//             const response = await fetch(event.endpoint);
//             const data = await response.json();



//             // Filter only images with valid URLs
//             const validPhotos = (data.results || data || []).filter(photo =>
//                 photo.media_type === 'image' && (photo.image || photo.thumbnail_url)
//             ).map(photo => ({
//                 ...photo,
//                 // Use thumbnail URL for display (fallback to full image if no thumbnail)
//                 thumbnail_url: photo.thumbnail_url ||
//                     (photo.image?.startsWith('http') ? photo.image : `http://127.0.0.1:8000${photo.image}`),
//                 // Store full image URL separately for later
//                 full_image_url: photo.image?.startsWith('http')
//                     ? photo.image
//                     : `http://127.0.0.1:8000${photo.image}`
//             }));



//             setPhotos(validPhotos);
//         } catch (error) {
//             console.error('Error fetching gallery:', error);
//             setPhotos([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const createPlaceholderSVG = (text = "Loading...") => {
//         const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
//             <rect width="300" height="300" fill="#667eea" opacity="0.3"/>
//             <text x="150" y="150" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="white">${text}</text>
//         </svg>`;
//         return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
//     };

//     const handleThumbnailLoad = (photoId) => {

//         setLoadedThumbnails(prev => ({ ...prev, [photoId]: true }));
//     };

//     const handleThumbnailError = (photoId, thumbnailUrl, e) => {
//         console.warn(`⚠️ Thumbnail failed for ${photoId}, trying full image`);

//         // Try loading full image instead
//         const photo = photos.find(p => p.id === photoId);
//         if (photo && photo.full_image_url && photo.full_image_url !== thumbnailUrl) {
//             console.log(`🔄 Switching to full image for ${photoId}`);
//             e.target.src = photo.full_image_url;
//         } else {
//             // Set fallback placeholder
//             e.target.src = createPlaceholderSVG(`Image not available`);
//             e.target.style.objectFit = 'contain';
//             e.target.style.padding = '20px';
//             e.target.style.backgroundColor = '#667eea40';
//         }
//     };

//     const handleCardClick = (photo, index) => {
//         // Save current scroll position before opening dialog
//         setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);


//         setSelectedImage(photo);
//         setCurrentImageIndex(index);
//         setDialogOpen(true);

//         // Preload the full image in background
//         if (!loadedFullImages[photo.id]) {
//             const img = new Image();
//             img.src = photo.full_image_url;
//             img.onload = () => {

//                 setLoadedFullImages(prev => ({ ...prev, [photo.id]: true }));
//             };
//             img.onerror = () => {
//                 console.error(`❌ Failed to load full image: ${photo.title}`);
//             };
//         }
//     };

//     const handleCloseDialog = () => {
//         setDialogOpen(false);
//         setTimeout(() => {
//             setSelectedImage(null);
//             setCurrentImageIndex(0);

//             // Restore scroll position after dialog closes
//             setTimeout(() => {
//                 window.scrollTo({
//                     top: scrollPosition,
//                     behavior: 'smooth'
//                 });
//             }, 100);
//         }, 300);
//     };

//     // Function to scroll to top
//     const scrollToTop = () => {
//         window.scrollTo({
//             top: 0,
//             behavior: 'smooth'
//         });
//     };

//     // Carousel navigation functions
//     const goToNextImage = useCallback(() => {
//         if (photos.length === 0) return;
//         const nextIndex = (currentImageIndex + 1) % photos.length;
//         setCurrentImageIndex(nextIndex);
//         setSelectedImage(photos[nextIndex]);

//         // Preload next image
//         if (!loadedFullImages[photos[nextIndex]?.id]) {
//             const img = new Image();
//             img.src = photos[nextIndex]?.full_image_url;
//             img.onload = () => {
//                 setLoadedFullImages(prev => ({ ...prev, [photos[nextIndex]?.id]: true }));
//             };
//         }
//     }, [currentImageIndex, photos, loadedFullImages]);

//     const goToPrevImage = useCallback(() => {
//         if (photos.length === 0) return;
//         const prevIndex = (currentImageIndex - 1 + photos.length) % photos.length;
//         setCurrentImageIndex(prevIndex);
//         setSelectedImage(photos[prevIndex]);

//         // Preload previous image
//         if (!loadedFullImages[photos[prevIndex]?.id]) {
//             const img = new Image();
//             img.src = photos[prevIndex]?.full_image_url;
//             img.onload = () => {
//                 setLoadedFullImages(prev => ({ ...prev, [photos[prevIndex]?.id]: true }));
//             };
//         }
//     }, [currentImageIndex, photos, loadedFullImages]);

//     // Keyboard navigation
//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (!dialogOpen) return;

//             switch (e.key) {
//                 case 'ArrowLeft':
//                     e.preventDefault();
//                     goToPrevImage();
//                     break;
//                 case 'ArrowRight':
//                     e.preventDefault();
//                     goToNextImage();
//                     break;
//                 case 'Escape':
//                     handleCloseDialog();
//                     break;
//                 default:
//                     break;
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [dialogOpen, goToPrevImage, goToNextImage]);

//     if (loading) {
//         return (
//             <Box sx={{
//                 minHeight: '100vh',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 background: 'transparent'
//             }}>
//                 <CircularProgress sx={{ color: 'white' }} />
//             </Box>
//         );
//     }

//     return (<>

//         <Box sx={{
//             minHeight: '100vh',
//             background: 'transparent',
//             py: 4,
//             position: 'relative'
//         }}>
//             <Container maxWidth="lg">
//                 {/* Header with back button */}
//                 <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                     <Button
//                         startIcon={<ArrowBackIcon />}
//                         onClick={() => navigate(-1)}
//                         sx={{ color: 'white' }}
//                     >
//                         Back to Events
//                     </Button>

//                     <Typography
//                         variant="h3"
//                         sx={{
//                             color: 'white',
//                             fontWeight: 'bold',
//                             textAlign: 'center'
//                         }}
//                     >
//                         {eventInfo?.title} Gallery
//                     </Typography>

//                     <Box sx={{ width: 100 }} /> {/* Spacer for centering */}
//                 </Box>

//                 {/* Photo count with optimization note */}
//                 <Typography
//                     variant="h6"
//                     sx={{
//                         color: 'rgba(255,255,255,0.8)',
//                         textAlign: 'center',
//                         mb: 4
//                     }}
//                 >
//                     {photos.length} precious memories • Thumbnails load first for faster viewing
//                 </Typography>

//                 {/* Photo Grid */}
//                 {photos.length === 0 ? (
//                     <Box sx={{ textAlign: 'center', color: 'white', py: 8 }}>
//                         <Typography variant="h5">No photos available yet</Typography>
//                         <Typography variant="body1" sx={{ mt: 2 }}>
//                             Check back soon for {eventInfo?.title} photos!
//                         </Typography>
//                     </Box>
//                 ) : (
//                     <Grid container spacing={2}>
//                         {photos.map((photo, index) => (
//                             <Grid key={photo.id || index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
//                                 <Card
//                                     sx={{
//                                         height: '300px',
//                                         cursor: 'pointer',
//                                         transition: 'transform 0.3s, box-shadow 0.3s',
//                                         overflow: 'hidden',
//                                         position: 'relative',
//                                         '&:hover': {
//                                             transform: 'scale(1.02)',
//                                             boxShadow: 6,
//                                             '& .hover-overlay': {
//                                                 opacity: 1
//                                             }
//                                         }
//                                     }}
//                                     onClick={() => handleCardClick(photo, index)}
//                                 >
//                                     {/* Skeleton loader while thumbnail loads */}
//                                     {!loadedThumbnails[photo.id] && (
//                                         <Skeleton
//                                             variant="rectangular"
//                                             width="100%"
//                                             height="100%"
//                                             sx={{
//                                                 position: 'absolute',
//                                                 top: 0,
//                                                 left: 0,
//                                                 bgcolor: 'rgba(255,255,255,0.1)'
//                                             }}
//                                         />
//                                     )}

//                                     {/* Hover overlay with zoom icon */}
//                                     <Box
//                                         className="hover-overlay"
//                                         sx={{
//                                             position: 'absolute',
//                                             top: 0,
//                                             left: 0,
//                                             right: 0,
//                                             bottom: 0,
//                                             backgroundColor: 'rgba(0,0,0,0.4)',
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             justifyContent: 'center',
//                                             opacity: 0,
//                                             transition: 'opacity 0.3s',
//                                             zIndex: 2
//                                         }}
//                                     >
//                                         <ZoomInIcon sx={{ color: 'white', fontSize: 48 }} />
//                                     </Box>

//                                     {/* Thumbnail Image */}
//                                     <CardMedia
//                                         component="img"
//                                         height="300"
//                                         image={photo.thumbnail_url || createPlaceholderSVG('Loading thumbnail...')}
//                                         alt={photo.title || `${eventInfo?.title} photo ${index + 1}`}
//                                         ref={(el) => {
//                                             if (el) imageRefs.current[photo.id] = el;
//                                         }}
//                                         sx={{
//                                             objectFit: 'cover',
//                                             width: '100%',
//                                             height: '100%',
//                                             transition: 'transform 0.5s, opacity 0.3s',
//                                             opacity: loadedThumbnails[photo.id] ? 1 : 0,
//                                             '&:hover': {
//                                                 transform: 'scale(1.05)'
//                                             }
//                                         }}
//                                         onLoad={() => handleThumbnailLoad(photo.id)}
//                                         onError={(e) => handleThumbnailError(photo.id, photo.thumbnail_url, e)}
//                                         loading="lazy"
//                                     />
//                                 </Card>

//                                 {/* Image title with optimization indicator */}
//                                 <Typography
//                                     variant="caption"
//                                     sx={{
//                                         color: 'white',
//                                         textAlign: 'center',
//                                         display: 'block',
//                                         mt: 1,
//                                         opacity: 0.8,
//                                         overflow: 'hidden',
//                                         textOverflow: 'ellipsis',
//                                         whiteSpace: 'nowrap'
//                                     }}
//                                     title={photo.title || `Photo ${index + 1}`}
//                                 >
//                                     {photo.title || `Photo ${index + 1}`}
//                                     {loadedThumbnails[photo.id] && ' • ✓'}
//                                 </Typography>
//                             </Grid>
//                         ))}
//                     </Grid>
//                 )}

//                 {/* Full Screen Image Modal with Carousel */}
//                 <Dialog
//                     open={dialogOpen}
//                     onClose={handleCloseDialog}
//                     maxWidth={false}
//                     fullWidth
//                     sx={{
//                         '& .MuiDialog-paper': {
//                             backgroundColor: 'rgba(0,0,0,0.97)',
//                             color: 'white',
//                             margin: 0,
//                             maxWidth: '100vw',
//                             maxHeight: '100vh',
//                             width: '100vw',
//                             height: '100vh',
//                             borderRadius: 0,
//                             overflow: 'hidden'
//                         }
//                     }}
//                 >
//                     <DialogContent
//                         sx={{
//                             p: 0,
//                             position: 'relative',
//                             height: '100%',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                         }}
//                     >
//                         {/* Close button - positioned absolutely */}
//                         <IconButton
//                             onClick={handleCloseDialog}
//                             sx={{
//                                 position: 'absolute',
//                                 right: 16,
//                                 top: 16,
//                                 color: 'white',
//                                 backgroundColor: 'rgba(0,0,0,0.6)',
//                                 zIndex: 10,
//                                 '&:hover': {
//                                     backgroundColor: 'rgba(0,0,0,0.8)'
//                                 }
//                             }}
//                         >
//                             <CloseIcon />
//                         </IconButton>

//                         {/* Download button */}
//                         {selectedImage && (
//                             <IconButton
//                                 onClick={async () => {
//                                     try {
//                                         // Try fetch approach first (more reliable)
//                                         const response = await fetch(selectedImage.full_image_url, {
//                                             mode: 'cors',
//                                             credentials: 'same-origin'
//                                         });

//                                         if (!response.ok) {
//                                             throw new Error(`HTTP error! status: ${response.status}`);
//                                         }

//                                         const blob = await response.blob();
//                                         const blobUrl = window.URL.createObjectURL(blob);
//                                         const link = document.createElement('a');
//                                         link.href = blobUrl;

//                                         // Get filename
//                                         let filename = selectedImage.title || 'wedding_photo';
//                                         const contentDisposition = response.headers.get('Content-Disposition');

//                                         if (contentDisposition) {
//                                             const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
//                                             if (match && match[1]) {
//                                                 filename = match[1].replace(/['"]/g, '');
//                                             }
//                                         }

//                                         link.download = filename;
//                                         document.body.appendChild(link);
//                                         link.click();
//                                         document.body.removeChild(link);

//                                         // Clean up
//                                         window.URL.revokeObjectURL(blobUrl);

//                                     } catch (error) {
//                                         console.error('Download failed, trying fallback:', error);

//                                         // Fallback method
//                                         const link = document.createElement('a');
//                                         link.href = selectedImage.full_image_url;
//                                         link.download = selectedImage.title || 'wedding_photo.jpg';
//                                         link.target = '_blank';
//                                         document.body.appendChild(link);
//                                         link.click();
//                                         document.body.removeChild(link);
//                                     }
//                                 }}
//                                 sx={{
//                                     position: 'absolute',
//                                     right: 70,
//                                     top: 16,
//                                     color: 'white',
//                                     backgroundColor: 'rgba(0,0,0,0.6)',
//                                     zIndex: 10,
//                                     '&:hover': {
//                                         backgroundColor: 'rgba(0,0,0,0.8)'
//                                     }
//                                 }}
//                                 title="Download Image"
//                             >
//                                 <DownloadIcon />
//                             </IconButton>
//                         )}

//                         {/* Left Arrow Navigation */}
//                         <IconButton
//                             onClick={goToPrevImage}
//                             sx={{
//                                 position: 'absolute',
//                                 left: 20,
//                                 top: '50%',
//                                 transform: 'translateY(-50%)',
//                                 color: 'white',
//                                 backgroundColor: 'rgba(0,0,0,0.6)',
//                                 zIndex: 10,
//                                 '&:hover': {
//                                     backgroundColor: 'rgba(0,0,0,0.8)'
//                                 },
//                                 width: 60,
//                                 height: 60
//                             }}
//                             disabled={photos.length <= 1}
//                         >
//                             <ArrowBackIosIcon fontSize="large" />
//                         </IconButton>

//                         {/* Right Arrow Navigation */}
//                         <IconButton
//                             onClick={goToNextImage}
//                             sx={{
//                                 position: 'absolute',
//                                 right: 20,
//                                 top: '50%',
//                                 transform: 'translateY(-50%)',
//                                 color: 'white',
//                                 backgroundColor: 'rgba(0,0,0,0.6)',
//                                 zIndex: 10,
//                                 '&:hover': {
//                                     backgroundColor: 'rgba(0,0,0,0.8)'
//                                 },
//                                 width: 60,
//                                 height: 60
//                             }}
//                             disabled={photos.length <= 1}
//                         >
//                             <ArrowForwardIosIcon fontSize="large" />
//                         </IconButton>

//                         {/* Image counter */}
//                         {selectedImage && (
//                             <Typography
//                                 variant="h6"
//                                 sx={{
//                                     position: 'absolute',
//                                     top: 20,
//                                     left: 20,
//                                     color: 'white',
//                                     backgroundColor: 'rgba(0,0,0,0.6)',
//                                     padding: '8px 16px',
//                                     borderRadius: '20px',
//                                     zIndex: 10
//                                 }}
//                             >
//                                 {currentImageIndex + 1} / {photos.length}
//                             </Typography>
//                         )}

//                         {/* Main Image Container */}
//                         {selectedImage && (
//                             <Box sx={{
//                                 width: '100%',
//                                 height: '100%',
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',

//                             }}>
//                                 {/* Loading indicator for full image */}
//                                 {!loadedFullImages[selectedImage.id] && (
//                                     <Box sx={{
//                                         position: 'absolute',
//                                         top: '50%',
//                                         left: '50%',
//                                         transform: 'translate(-50%, -50%)',
//                                         textAlign: 'center'
//                                     }}>
//                                         <CircularProgress sx={{ color: 'white' }} size={60} />
//                                         <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
//                                             Loading high-resolution image...
//                                         </Typography>
//                                         <Typography variant="caption" sx={{
//                                             color: 'rgba(255,255,255,0.7)',
//                                             display: 'block',
//                                             mt: 1
//                                         }}>
//                                             (Image {currentImageIndex + 1} of {photos.length})
//                                         </Typography>
//                                     </Box>
//                                 )}

//                                 {/* Full Image */}
//                                 <Box sx={{
//                                     width: '100%',
//                                     height: '100%',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     position: 'relative'
//                                 }}>
//                                     <img
//                                         src={selectedImage.full_image_url}
//                                         alt={selectedImage.title}
//                                         style={{
//                                             maxWidth: '100%',
//                                             maxHeight: '100%',
//                                             objectFit: 'contain',
//                                             opacity: loadedFullImages[selectedImage.id] ? 1 : 0,
//                                             transition: 'opacity 0.5s ease-in-out',
//                                             boxShadow: '0 0 40px rgba(0,0,0,0.5)'
//                                         }}
//                                         onLoad={() => setLoadedFullImages(prev => ({ ...prev, [selectedImage.id]: true }))}
//                                         onError={(e) => {
//                                             console.error('Failed to load full image:', selectedImage.full_image_url);
//                                             e.target.src = createPlaceholderSVG('High-resolution image not available');
//                                             e.target.style.objectFit = 'contain';
//                                             e.target.style.padding = '40px';
//                                             e.target.style.backgroundColor = '#667eea20';
//                                         }}
//                                     />
//                                 </Box>

//                                 {/* Image info panel */}
//                                 <Box
//                                     sx={{
//                                         position: 'absolute',
//                                         bottom: 0,
//                                         left: 0,
//                                         right: 0,
//                                         background: 'black',
//                                         padding: '20px',
//                                         color: 'white',
//                                         opacity: 0,
//                                         transition: 'opacity 0.3s',
//                                         '&:hover': {
//                                             opacity: 1
//                                         }
//                                     }}
//                                 >
//                                     <Typography variant="h6">
//                                         {selectedImage.title}
//                                     </Typography>
//                                     {selectedImage.description && (
//                                         <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
//                                             {selectedImage.description}
//                                         </Typography>
//                                     )}
//                                     <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
//                                         Category: {selectedImage.category}
//                                     </Typography>
//                                 </Box>

//                                 {/* Navigation hint */}
//                                 {photos.length > 1 && (
//                                     <Box
//                                         sx={{
//                                             position: 'absolute',
//                                             bottom: 20,
//                                             left: 0,
//                                             right: 0,
//                                             textAlign: 'center',
//                                             opacity: 0.6,
//                                             transition: 'opacity 1s',
//                                             animation: 'fadeOut 3s forwards',
//                                             '@keyframes fadeOut': {
//                                                 '0%': { opacity: 0.6 },
//                                                 '70%': { opacity: 0.6 },
//                                                 '100%': { opacity: 0 }
//                                             }
//                                         }}
//                                     >
//                                         <Typography variant="caption" sx={{ color: 'white' }}>
//                                             Use ← → arrows or keyboard keys to navigate • Press ESC to close
//                                         </Typography>
//                                     </Box>
//                                 )}

//                                 {/* Zoom controls */}
//                                 {loadedFullImages[selectedImage.id] && (
//                                     <Box
//                                         sx={{
//                                             position: 'absolute',
//                                             bottom: 80,
//                                             right: 20,
//                                             display: 'flex',
//                                             gap: 1,
//                                             backgroundColor: 'rgba(0,0,0,0.6)',
//                                             borderRadius: '8px',
//                                             padding: '8px'
//                                         }}
//                                     >
//                                         <IconButton
//                                             onClick={() => {
//                                                 const img = document.querySelector('img[src*="' + selectedImage.full_image_url + '"]');
//                                                 if (img) {
//                                                     img.style.transform = img.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)';
//                                                     img.style.transition = 'transform 0.3s ease';
//                                                 }
//                                             }}
//                                             sx={{ color: 'white' }}
//                                             title="Zoom In/Out"
//                                         >
//                                             <ZoomInIcon />
//                                         </IconButton>
//                                         <IconButton
//                                             onClick={() => {
//                                                 const img = document.querySelector('img[src*="' + selectedImage.full_image_url + '"]');
//                                                 if (img) {
//                                                     img.style.transform = 'scale(1)';
//                                                     img.style.transition = 'transform 0.3s ease';
//                                                 }
//                                             }}
//                                             sx={{ color: 'white' }}
//                                             title="Reset Zoom"
//                                         >
//                                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                                 <path d="M10 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" />
//                                             </svg>
//                                         </IconButton>
//                                     </Box>
//                                 )}
//                             </Box>
//                         )}
//                     </DialogContent>
//                 </Dialog>
//             </Container>

//             {/* Back to Top Button - Add this at the end before closing Box */}
//             {showBackToTop && (
//                 <IconButton
//                     onClick={scrollToTop}
//                     sx={{
//                         position: 'fixed',
//                         bottom: 30,
//                         right: 30,
//                         backgroundColor: 'rgba(255, 255, 255, 0.15)',
//                         backdropFilter: 'blur(10px)',
//                         border: '1px solid rgba(255, 255, 255, 0.2)',
//                         color: 'white',
//                         width: 56,
//                         height: 56,
//                         zIndex: 1000,
//                         '&:hover': {
//                             backgroundColor: 'rgba(255, 255, 255, 0.25)',
//                             transform: 'translateY(-4px)',
//                             boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
//                         },
//                         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                         boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
//                         animation: 'fadeIn 0.3s ease',
//                         '@keyframes fadeIn': {
//                             '0%': { opacity: 0, transform: 'translateY(20px)' },
//                             '100%': { opacity: 1, transform: 'translateY(0)' }
//                         }
//                     }}
//                     title="Back to Top"
//                 >
//                     <KeyboardArrowUpIcon fontSize="large" />
//                 </IconButton>
//             )}
//         </Box></>
//     );
// }


// ************************************************

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiServices } from '../../services/api'; // Import API service

import {
    Container,
    Box,
    Typography,
    Button,
    CircularProgress,
    Grid,
    Card,
    CardMedia,
    Skeleton,
    Dialog,
    DialogContent,
    IconButton,

} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Use environment variable or fallback
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function EventGallery() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventInfo, setEventInfo] = useState(null);
    const [loadedThumbnails, setLoadedThumbnails] = useState({});
    const [loadedFullImages, setLoadedFullImages] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const imageRefs = useRef({});

    // Fixed: Use consistent category names from your Gallery component
    const eventMap = {
        1: {
            title: "Pre-Wedding",
            category: "pre_wedding",
            color: "#ff4081"
        },
        2: {
            title: "Mehndi Night",
            category: "mehndi",
            color: "#7c4dff"
        },
        3: {
            title: "Haldi Ceremony",
            category: "haldi",
            color: "#00bcd4"
        },
        4: {
            title: "Sagan Ceremony",
            category: "sagan",
            color: "#ff9100"
        },
        5: {
            title: "Wedding Day",
            category: "wedding",
            color: "#ff1744"
        }
    };

    useEffect(() => {
        fetchGalleryData();
    }, [eventId]);

    // Add scroll listener for Back to Top button
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.pageYOffset > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Add popstate listener for browser back button
    useEffect(() => {
        const handlePopState = () => {
            // Restore scroll position when user comes back via browser back button
            setTimeout(() => {
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }, 100);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [scrollPosition]);

    const fetchGalleryData = async () => {
        try {
            setLoading(true);
            const event = eventMap[eventId];
            setEventInfo(event);

            // Use the API service instead of direct fetch
            const data = await apiServices.getImagesByCategory(event.category);

            // Filter only images with valid URLs
            const validPhotos = (data.results || data || []).filter(photo =>
                photo.media_type === 'image' && (photo.image || photo.thumbnail_url)
            ).map(photo => ({
                ...photo,
                // Use thumbnail URL for display (fallback to full image if no thumbnail)
                thumbnail_url: photo.thumbnail_url ||
                    (photo.image?.startsWith('http') ? photo.image : `${API_BASE}${photo.image}`),
                // Store full image URL separately for later
                full_image_url: photo.image?.startsWith('http')
                    ? photo.image
                    : `${API_BASE}${photo.image}`
            }));

            setPhotos(validPhotos);
        } catch (error) {
            console.error('Error fetching gallery:', error);
            setPhotos([]);
        } finally {
            setLoading(false);
        }
    };

    const createPlaceholderSVG = (text = "Loading...") => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
            <rect width="300" height="300" fill="#667eea" opacity="0.3"/>
            <text x="150" y="150" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="white">${text}</text>
        </svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    };

    const handleThumbnailLoad = (photoId) => {
        setLoadedThumbnails(prev => ({ ...prev, [photoId]: true }));
    };

    const handleThumbnailError = (photoId, thumbnailUrl, e) => {
        console.warn(`⚠️ Thumbnail failed for ${photoId}, trying full image`);

        // Try loading full image instead
        const photo = photos.find(p => p.id === photoId);
        if (photo && photo.full_image_url && photo.full_image_url !== thumbnailUrl) {
            console.log(`🔄 Switching to full image for ${photoId}`);
            e.target.src = photo.full_image_url;
        } else {
            // Set fallback placeholder
            e.target.src = createPlaceholderSVG(`Image not available`);
            e.target.style.objectFit = 'contain';
            e.target.style.padding = '20px';
            e.target.style.backgroundColor = '#667eea40';
        }
    };

    const handleCardClick = (photo, index) => {
        // Save current scroll position before opening dialog
        setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);

        setSelectedImage(photo);
        setCurrentImageIndex(index);
        setDialogOpen(true);

        // Preload the full image in background
        if (!loadedFullImages[photo.id]) {
            const img = new Image();
            img.src = photo.full_image_url;
            img.onload = () => {
                setLoadedFullImages(prev => ({ ...prev, [photo.id]: true }));
            };
            img.onerror = () => {
                console.error(`❌ Failed to load full image: ${photo.title}`);
            };
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setTimeout(() => {
            setSelectedImage(null);
            setCurrentImageIndex(0);

            // Restore scroll position after dialog closes
            setTimeout(() => {
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }, 300);
    };

    // Function to scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Carousel navigation functions
    const goToNextImage = useCallback(() => {
        if (photos.length === 0) return;
        const nextIndex = (currentImageIndex + 1) % photos.length;
        setCurrentImageIndex(nextIndex);
        setSelectedImage(photos[nextIndex]);

        // Preload next image
        if (!loadedFullImages[photos[nextIndex]?.id]) {
            const img = new Image();
            img.src = photos[nextIndex]?.full_image_url;
            img.onload = () => {
                setLoadedFullImages(prev => ({ ...prev, [photos[nextIndex]?.id]: true }));
            };
        }
    }, [currentImageIndex, photos, loadedFullImages]);

    const goToPrevImage = useCallback(() => {
        if (photos.length === 0) return;
        const prevIndex = (currentImageIndex - 1 + photos.length) % photos.length;
        setCurrentImageIndex(prevIndex);
        setSelectedImage(photos[prevIndex]);

        // Preload previous image
        if (!loadedFullImages[photos[prevIndex]?.id]) {
            const img = new Image();
            img.src = photos[prevIndex]?.full_image_url;
            img.onload = () => {
                setLoadedFullImages(prev => ({ ...prev, [photos[prevIndex]?.id]: true }));
            };
        }
    }, [currentImageIndex, photos, loadedFullImages]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!dialogOpen) return;

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    goToPrevImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    goToNextImage();
                    break;
                case 'Escape':
                    handleCloseDialog();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dialogOpen, goToPrevImage, goToNextImage]);

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent'
            }}>
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    return (<>
        <Box sx={{
            minHeight: '100vh',
            background: 'transparent',
            py: 4,
            position: 'relative'
        }}>
            <Container maxWidth="lg">
                {/* Header with back button */}
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        sx={{ color: 'white' }}
                    >
                        Back to Events
                    </Button>

                    <Typography
                        variant="h3"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}
                    >
                        {eventInfo?.title} Gallery
                    </Typography>

                    <Box sx={{ width: 100 }} /> {/* Spacer for centering */}
                </Box>

                {/* Photo count with optimization note */}
                <Typography
                    variant="h6"
                    sx={{
                        color: 'rgba(255,255,255,0.8)',
                        textAlign: 'center',
                        mb: 4
                    }}
                >
                    {photos.length} precious memories • Thumbnails load first for faster viewing
                </Typography>

                {/* Photo Grid */}
                {photos.length === 0 ? (
                    <Box sx={{ textAlign: 'center', color: 'white', py: 8 }}>
                        <Typography variant="h5">No photos available yet</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Check back soon for {eventInfo?.title} photos!
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {photos.map((photo, index) => (
                            <Grid key={photo.id || index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <Card
                                    sx={{
                                        height: '300px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: 6,
                                            '& .hover-overlay': {
                                                opacity: 1
                                            }
                                        }
                                    }}
                                    onClick={() => handleCardClick(photo, index)}
                                >
                                    {/* Skeleton loader while thumbnail loads */}
                                    {!loadedThumbnails[photo.id] && (
                                        <Skeleton
                                            variant="rectangular"
                                            width="100%"
                                            height="100%"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                bgcolor: 'rgba(255,255,255,0.1)'
                                            }}
                                        />
                                    )}

                                    {/* Hover overlay with zoom icon */}
                                    <Box
                                        className="hover-overlay"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0,0,0,0.4)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'opacity 0.3s',
                                            zIndex: 2
                                        }}
                                    >
                                        <ZoomInIcon sx={{ color: 'white', fontSize: 48 }} />
                                    </Box>

                                    {/* Thumbnail Image */}
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={photo.thumbnail_url || createPlaceholderSVG('Loading thumbnail...')}
                                        alt={photo.title || `${eventInfo?.title} photo ${index + 1}`}
                                        ref={(el) => {
                                            if (el) imageRefs.current[photo.id] = el;
                                        }}
                                        sx={{
                                            objectFit: 'cover',
                                            width: '100%',
                                            height: '100%',
                                            transition: 'transform 0.5s, opacity 0.3s',
                                            opacity: loadedThumbnails[photo.id] ? 1 : 0,
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                        onLoad={() => handleThumbnailLoad(photo.id)}
                                        onError={(e) => handleThumbnailError(photo.id, photo.thumbnail_url, e)}
                                        loading="lazy"
                                    />
                                </Card>

                                {/* Image title with optimization indicator */}
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'white',
                                        textAlign: 'center',
                                        display: 'block',
                                        mt: 1,
                                        opacity: 0.8,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                    title={photo.title || `Photo ${index + 1}`}
                                >
                                    {photo.title || `Photo ${index + 1}`}
                                    {loadedThumbnails[photo.id] && ' • ✓'}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Full Screen Image Modal with Carousel */}
                <Dialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    maxWidth={false}
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            backgroundColor: 'rgba(0,0,0,0.97)',
                            color: 'white',
                            margin: 0,
                            maxWidth: '100vw',
                            maxHeight: '100vh',
                            width: '100vw',
                            height: '100vh',
                            borderRadius: 0,
                            overflow: 'hidden'
                        }
                    }}
                >
                    <DialogContent
                        sx={{
                            p: 0,
                            position: 'relative',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Close button - positioned absolutely */}
                        <IconButton
                            onClick={handleCloseDialog}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                top: 16,
                                color: 'white',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                zIndex: 10,
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.8)'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {/* Download button */}
                        {selectedImage && (
                            <IconButton
                                onClick={async () => {
                                    try {
                                        // Try fetch approach first (more reliable)
                                        const response = await fetch(selectedImage.full_image_url, {
                                            mode: 'cors',
                                            credentials: 'same-origin'
                                        });

                                        if (!response.ok) {
                                            throw new Error(`HTTP error! status: ${response.status}`);
                                        }

                                        const blob = await response.blob();
                                        const blobUrl = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = blobUrl;

                                        // Get filename
                                        let filename = selectedImage.title || 'wedding_photo';
                                        const contentDisposition = response.headers.get('Content-Disposition');

                                        if (contentDisposition) {
                                            const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                                            if (match && match[1]) {
                                                filename = match[1].replace(/['"]/g, '');
                                            }
                                        }

                                        link.download = filename;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);

                                        // Clean up
                                        window.URL.revokeObjectURL(blobUrl);

                                    } catch (error) {
                                        console.error('Download failed, trying fallback:', error);

                                        // Fallback method
                                        const link = document.createElement('a');
                                        link.href = selectedImage.full_image_url;
                                        link.download = selectedImage.title || 'wedding_photo.jpg';
                                        link.target = '_blank';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }
                                }}
                                sx={{
                                    position: 'absolute',
                                    right: 70,
                                    top: 16,
                                    color: 'white',
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    zIndex: 10,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.8)'
                                    }
                                }}
                                title="Download Image"
                            >
                                <DownloadIcon />
                            </IconButton>
                        )}

                        {/* Left Arrow Navigation */}
                        <IconButton
                            onClick={goToPrevImage}
                            sx={{
                                position: 'absolute',
                                left: 20,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'white',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                zIndex: 10,
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.8)'
                                },
                                width: 60,
                                height: 60
                            }}
                            disabled={photos.length <= 1}
                        >
                            <ArrowBackIosIcon fontSize="large" />
                        </IconButton>

                        {/* Right Arrow Navigation */}
                        <IconButton
                            onClick={goToNextImage}
                            sx={{
                                position: 'absolute',
                                right: 20,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'white',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                zIndex: 10,
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.8)'
                                },
                                width: 60,
                                height: 60
                            }}
                            disabled={photos.length <= 1}
                        >
                            <ArrowForwardIosIcon fontSize="large" />
                        </IconButton>

                        {/* Image counter */}
                        {selectedImage && (
                            <Typography
                                variant="h6"
                                sx={{
                                    position: 'absolute',
                                    top: 20,
                                    left: 20,
                                    color: 'white',
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    zIndex: 10
                                }}
                            >
                                {currentImageIndex + 1} / {photos.length}
                            </Typography>
                        )}

                        {/* Main Image Container */}
                        {selectedImage && (
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',

                            }}>
                                {/* Loading indicator for full image */}
                                {!loadedFullImages[selectedImage.id] && (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        textAlign: 'center'
                                    }}>
                                        <CircularProgress sx={{ color: 'white' }} size={60} />
                                        <Typography variant="body1" sx={{ color: 'white', mt: 2 }}>
                                            Loading high-resolution image...
                                        </Typography>
                                        <Typography variant="caption" sx={{
                                            color: 'rgba(255,255,255,0.7)',
                                            display: 'block',
                                            mt: 1
                                        }}>
                                            (Image {currentImageIndex + 1} of {photos.length})
                                        </Typography>
                                    </Box>
                                )}

                                {/* Full Image */}
                                <Box sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <img
                                        src={selectedImage.full_image_url}
                                        alt={selectedImage.title}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain',
                                            opacity: loadedFullImages[selectedImage.id] ? 1 : 0,
                                            transition: 'opacity 0.5s ease-in-out',
                                            boxShadow: '0 0 40px rgba(0,0,0,0.5)'
                                        }}
                                        onLoad={() => setLoadedFullImages(prev => ({ ...prev, [selectedImage.id]: true }))}
                                        onError={(e) => {
                                            console.error('Failed to load full image:', selectedImage.full_image_url);
                                            e.target.src = createPlaceholderSVG('High-resolution image not available');
                                            e.target.style.objectFit = 'contain';
                                            e.target.style.padding = '40px';
                                            e.target.style.backgroundColor = '#667eea20';
                                        }}
                                    />
                                </Box>

                                {/* Image info panel */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'black',
                                        padding: '20px',
                                        color: 'white',
                                        opacity: 0,
                                        transition: 'opacity 0.3s',
                                        '&:hover': {
                                            opacity: 1
                                        }
                                    }}
                                >
                                    <Typography variant="h6">
                                        {selectedImage.title}
                                    </Typography>
                                    {selectedImage.description && (
                                        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                                            {selectedImage.description}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                                        Category: {selectedImage.category}
                                    </Typography>
                                </Box>

                                {/* Navigation hint */}
                                {photos.length > 1 && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 20,
                                            left: 0,
                                            right: 0,
                                            textAlign: 'center',
                                            opacity: 0.6,
                                            transition: 'opacity 1s',
                                            animation: 'fadeOut 3s forwards',
                                            '@keyframes fadeOut': {
                                                '0%': { opacity: 0.6 },
                                                '70%': { opacity: 0.6 },
                                                '100%': { opacity: 0 }
                                            }
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ color: 'white' }}>
                                            Use ← → arrows or keyboard keys to navigate • Press ESC to close
                                        </Typography>
                                    </Box>
                                )}

                                {/* Zoom controls */}
                                {loadedFullImages[selectedImage.id] && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 80,
                                            right: 20,
                                            display: 'flex',
                                            gap: 1,
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            borderRadius: '8px',
                                            padding: '8px'
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => {
                                                const img = document.querySelector('img[src*="' + selectedImage.full_image_url + '"]');
                                                if (img) {
                                                    img.style.transform = img.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)';
                                                    img.style.transition = 'transform 0.3s ease';
                                                }
                                            }}
                                            sx={{ color: 'white' }}
                                            title="Zoom In/Out"
                                        >
                                            <ZoomInIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                const img = document.querySelector('img[src*="' + selectedImage.full_image_url + '"]');
                                                if (img) {
                                                    img.style.transform = 'scale(1)';
                                                    img.style.transition = 'transform 0.3s ease';
                                                }
                                            }}
                                            sx={{ color: 'white' }}
                                            title="Reset Zoom"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M10 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" />
                                            </svg>
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            </Container>

            {/* Back to Top Button - Add this at the end before closing Box */}
            {showBackToTop && (
                <IconButton
                    onClick={scrollToTop}
                    sx={{
                        position: 'fixed',
                        bottom: 30,
                        right: 30,
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        width: 56,
                        height: 56,
                        zIndex: 1000,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            transform: 'translateY(-4px)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                        animation: 'fadeIn 0.3s ease',
                        '@keyframes fadeIn': {
                            '0%': { opacity: 0, transform: 'translateY(20px)' },
                            '100%': { opacity: 1, transform: 'translateY(0)' }
                        }
                    }}
                    title="Back to Top"
                >
                    <KeyboardArrowUpIcon fontSize="large" />
                </IconButton>
            )}
        </Box></>
    );
}