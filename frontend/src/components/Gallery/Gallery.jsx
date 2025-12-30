// import React, { useEffect, useRef, useState } from 'react'
// import "./Gallery.css"
// import {
//   Card,
//   CardMedia,
//   Typography,
//   Box,
//   Chip,
//   Grid,
//   Container,
//   CircularProgress
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import loveIcon from '../../assets/icons/love_1.svg';
// import mehndiIcon from '../../assets/icons/mehndi_1.png';
// import weddingArchIcon from '../../assets/icons/wedding-arch.png';
// import weddingRingsIcon from '../../assets/icons/wedding-rings.png';
// import bridalIcon from '../../assets/icons/wedding.png';
// import pre_wedding from '../../assets/images/sections/gallery/pre_wedding.jpg'
// import mehndi from '../../assets/images/sections/gallery/mehndi.jpg'
// import haldi from '../../assets/images/sections/gallery/haldi.jpeg'
// import sagan from '../../assets/images/sections/gallery/sagan.jpg'
// import wedding from '../../assets/images/sections/gallery/wedding.jpg'
// import { useNavigate } from 'react-router-dom';
// import { gsap } from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

// gsap.registerPlugin(ScrollTrigger);

// const API_BASE = 'http://127.0.0.1:8000';

// export default function Gallery() {
//   const navigate = useNavigate();
//   const sectionRef = useRef(null)
//   const [loading, setLoading] = useState(true);
//   const [events, setEvents] = useState([
//     {
//       id: 1,
//       title: "Pre-Wedding",
//       date: "Feb 10, 2024",
//       icon: loveIcon,
//       description: "Romantic moments",
//       image: pre_wedding,
//       endpoint: `${API_BASE}/gallery/images/?category=pre_wedding`,
//       alt: "Couple pre-wedding photoshoot",
//       photoCount: 0
//     },
//     {
//       id: 2,
//       title: "Mehndi Night",
//       date: "Feb 12, 2024",
//       icon: mehndiIcon,
//       description: "Artistic colorful celebrations",
//       image: mehndi,
//       endpoint: `${API_BASE}/gallery/images/?category=mehndi`,
//       alt: "Mehndi ceremony with bride and groom",
//       photoCount: 0
//     },
//     {
//       id: 3,
//       title: "Haldi",
//       date: "Feb 13, 2024",
//       icon: weddingArchIcon,
//       description: "Golden turmeric blessings",
//       image: haldi,
//       endpoint: `${API_BASE}/gallery/images/?category=haldi`,
//       alt: "Haldi ceremony photos",
//       photoCount: 0
//     },
//     {
//       id: 4,
//       title: "Sagan",
//       date: "Feb 14, 2024",
//       icon: weddingRingsIcon,
//       description: "Exchange promises",
//       image: sagan,
//       endpoint: `${API_BASE}/gallery/images/?category=sagan`,
//       alt: "Sagan/engagement ceremony",
//       photoCount: 0
//     },
//     {
//       id: 5,
//       title: "Wedding Day",
//       date: "Feb 15, 2024",
//       icon: bridalIcon,
//       description: "The beginning of forever",
//       image: wedding,
//       endpoint: `${API_BASE}/gallery/images/?category=wedding`,
//       alt: "Wedding day celebrations",
//       photoCount: 0
//     }
//   ]);

//   // Fetch photo counts
//   useEffect(() => {
//     const fetchAllPhotoCounts = async () => {
//       try {
//         setLoading(true);
//         const eventsWithCounts = await Promise.all(
//           events.map(async (event) => {
//             try {
//               const response = await fetch(event.endpoint);
//               if (!response.ok) {
//                 return { ...event, photoCount: 0 };
//               }
//               const data = await response.json();
//               let photoCount = 0;
//               if (Array.isArray(data)) {
//                 photoCount = data.length;
//               } else if (data.results && Array.isArray(data.results)) {
//                 photoCount = data.results.length;
//               } else if (data.count !== undefined) {
//                 photoCount = data.count;
//               }
//               return { ...event, photoCount };
//             } catch (error) {
//               return { ...event, photoCount: 0 };
//             }
//           })
//         );
//         setEvents(eventsWithCounts);
//       } catch (error) {
//         console.error('Error in fetchAllPhotoCounts:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAllPhotoCounts();
//   }, []);

//   // GSAP Scroll Animation - FIXED with null checks
//   // GSAP Scroll Animation - FIXED for CSS variables
//   // Add this inside your GSAP useEffect for debugging
//   useEffect(() => {
//     if (!sectionRef.current) {
//       return;
//     }

//     const ctx = gsap.context(() => {
//       const sectionElement = sectionRef.current;

//       console.log('Section element:', sectionElement);
//       console.log('Initial CSS variable:', getComputedStyle(sectionElement).getPropertyValue('--gradient-opacity'));

//       // Set initial value
//       sectionElement.style.setProperty('--gradient-opacity', '0');
//       console.log('After setting to 0:', getComputedStyle(sectionElement).getPropertyValue('--gradient-opacity'));

//       const t1 = gsap.timeline({
//         scrollTrigger: {
//           trigger: sectionElement,
//           start: "top 80%",
//           end: "bottom 20%",
//           scrub: 1.2,
//           markers: true, // Enable markers to see scroll trigger area
//         },
//         onUpdate: () => {
//           // Debug: log current value during animation
//           console.log('Current opacity:', getComputedStyle(sectionElement).getPropertyValue('--gradient-opacity'));
//         }
//       });

//       t1.to(sectionElement, {
//         '--gradient-opacity': 1,
//         duration: 2,
//         ease: "power2.out",
//         onComplete: () => {
//           console.log('Animation complete, opacity should be 1:', getComputedStyle(sectionElement).getPropertyValue('--gradient-opacity'));
//         }
//       })
//         .to(sectionElement, {
//           '--gradient-opacity': 0,
//           duration: 2,
//           ease: "power2.in",
//           onComplete: () => {
//             console.log('Animation back to 0 complete:', getComputedStyle(sectionElement).getPropertyValue('--gradient-opacity'));
//           }
//         });

//     }, sectionRef);

//     return () => {
//       if (ctx && ctx.revert) {
//         ctx.revert();
//       }
//     };
//   }, []);

//   const handleCardClick = (eventId) => {
//     navigate(`/gallery/${eventId}`);
//   };

//   // Custom styled card with glassmorphism
//   const EventCard = styled(Card)(({ theme }) => ({
//     height: '400px',
//     position: 'relative',
//     border: "2px solid rgba(255, 255, 255, 0.2)",
//     borderRadius: "16px",
//     overflow: "hidden",
//     background: 'rgba(255, 255, 255, 0.05)',
//     backdropFilter: 'blur(10px)',
//     cursor: 'pointer',
//     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//     '&:hover': {
//       transform: 'translateY(-8px) scale(1.02)',

//       borderRadius: "16px",
//       boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.5)',
//       borderColor: 'rgba(255, 255, 255, 4)',
//     },
//   }));

//   // Glassmorphism overlay for content - TRANSPARENT BACKGROUND
//   const ContentOverlay = styled(Box)({
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: '15px',
//     color: 'white',
//     background: 'transparent',
//     backdropFilter: 'none',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px'
//   });

//   const totalPhotos = events.reduce((sum, event) => sum + (event.photoCount || 0), 0);

//   if (loading) {
//     return (
//       <Box sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'transparent'
//       }}>
//         <CircularProgress sx={{ color: '#FFD700' }} />
//       </Box>
//     );
//   }

//   return (
//     <Box className="GalleryParent" ref={sectionRef} sx={{
//       minHeight: '100vh',
//       px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
//       position: 'relative',
//     }}>
//       <Container maxWidth="xl">
//         {/* Header */}
//         <Box textAlign="center" mb={8}>
//           <Typography
//             variant="h2"
//             sx={{
//               color: '#FFFFFF',
//               fontWeight: 300,
//               letterSpacing: '0.2em',
//               textTransform: 'uppercase',
//               fontSize: {
//                 xs: '1.5rem',
//                 sm: '2rem',
//                 md: '2.5rem',
//                 lg: '3rem',
//                 xl: '3.5rem'
//               },
//             }}
//           >
//             • Capture The Love •
//           </Typography>
//           <Typography variant="h8" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//             Click on any event to view the memories
//           </Typography>
//         </Box>

//         {/* Event Cards Grid */}
//         <Grid container spacing={3} justifyContent="center">
//           {events.map(event => (
//             <Grid key={event.id} size={{ xs: 12, sm: 6, md: 2, lg: 5, xl: 6 }}>
//               <EventCard
//                 onClick={() => handleCardClick(event.id)}
//                 sx={{
//                   width: {
//                     xs: "100%",
//                     sm: "85%",
//                     md: "100%",
//                     xl: "100%"
//                   },
//                   boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.2)"
//                 }}
//               >
//                 <CardMedia
//                   component="img"
//                   height="400"
//                   image={event.image}
//                   alt={event.title}
//                   sx={{
//                     width: "100%",
//                     objectFit: 'cover',
//                   }}
//                 />
//                 <ContentOverlay className="content-overlay">
//                   {/* First row: Icon + Title */}
//                   <Box display="flex" alignItems="center" gap={1.5}>
//                     {/* Icon with glass background */}
//                     <Box sx={{
//                       p: 0.8,
//                       background: 'rgba(255,255,255,0.1)',
//                       backdropFilter: 'blur(8px)',
//                       borderRadius: '8px',
//                       border: '1px solid rgba(255,255,255,0.2)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       minWidth: '40px',
//                       minHeight: '40px'
//                     }}>
//                       <img
//                         src={event.icon}
//                         alt={event.title}
//                         width={20}
//                         style={{ filter: "brightness(0) invert(1)" }}
//                       />
//                     </Box>

//                     {/* Title with glass background */}
//                     <Box sx={{
//                       background: 'rgba(255,255,255,0.1)',
//                       backdropFilter: 'blur(8px)',
//                       borderRadius: '8px',
//                       border: '1px solid rgba(255,255,255,0.2)',
//                       px: 1.2,
//                       py: 0.4
//                     }}>
//                       <Typography sx={{
//                         color: "white",
//                         fontWeight: "bold",
//                         fontFamily: "'Playfair Display', serif",
//                         fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
//                         textShadow: '0 2px 4px rgba(0,0,0,0.5)'
//                       }}>
//                         {event.title}
//                       </Typography>
//                     </Box>
//                   </Box>

//                   {/* Description with glass background */}
//                   <Box sx={{
//                     background: 'rgba(255,255,255,0.1)',
//                     backdropFilter: 'blur(8px)',
//                     borderRadius: '8px',
//                     border: '1px solid rgba(255,255,255,0.2)',
//                     px: 1.2,
//                     py: 0.8,
//                     alignSelf: 'flex-start',
//                     maxWidth: '90%'
//                   }}>
//                     <Typography variant="body2" sx={{
//                       opacity: 0.9,
//                       fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
//                       lineHeight: 1.4,
//                       color: 'white'
//                     }}>
//                       {event.description}
//                     </Typography>
//                   </Box>

//                   {/* Chip with glass background */}
//                   <Box sx={{ alignSelf: 'flex-start' }}>
//                     <Chip
//                       label={`${event.photoCount || 0} photos`}
//                       sx={{
//                         background: 'rgba(255,255,255,0.15)',
//                         backdropFilter: 'blur(10px)',
//                         color: 'white',
//                         border: '1px solid rgba(255,255,255,0.3)',
//                         fontWeight: 500,
//                         fontSize: '0.85rem',
//                         '&:hover': {
//                           background: 'rgba(255,255,255,0.25)',
//                         }
//                       }}
//                     />
//                   </Box>
//                 </ContentOverlay>
//               </EventCard>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Total Photos Counter */}
//         <Box textAlign="center" mt={4} color="white">
//           <Typography variant="h3" fontWeight="bold">
//             {totalPhotos}
//           </Typography>
//           <Typography variant="h6" sx={{ opacity: 0.8 }}>
//             Precious Memories Captured
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   );
// }


// ************************************************************

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import "./Gallery.css"
import {
  Card,
  CardMedia,
  Typography,
  Box,
  Chip,
  Grid,
  Container,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import loveIcon from '../../assets/icons/love_1.svg';
import mehndiIcon from '../../assets/icons/mehndi_1.png';
import weddingArchIcon from '../../assets/icons/wedding-arch.png';
import weddingRingsIcon from '../../assets/icons/wedding-rings.png';
import bridalIcon from '../../assets/icons/wedding.png';
import pre_wedding from '../../assets/images/sections/gallery/pre_wedding.jpg'
import mehndi from '../../assets/images/sections/gallery/mehndi.jpg'
import haldi from '../../assets/images/sections/gallery/haldi.jpeg'
import sagan from '../../assets/images/sections/gallery/sagan.jpg'
import wedding from '../../assets/images/sections/gallery/wedding.jpg'
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { apiServices } from '../../services/api'; // Import from services

gsap.registerPlugin(ScrollTrigger);


export default function Gallery() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize the events configuration
  const eventsConfig = useMemo(() => [
    {
      id: 1,
      title: "Pre-Wedding",
      date: "Feb 10, 2024",
      icon: loveIcon,
      description: "Romantic moments",
      image: pre_wedding,
      category: "pre_wedding",
      alt: "Couple pre-wedding photoshoot",
      photoCount: 0
    },
    {
      id: 2,
      title: "Mehndi Night",
      date: "Feb 12, 2024",
      icon: mehndiIcon,
      description: "Artistic colorful celebrations",
      image: mehndi,
      category: "mehndi",
      alt: "Mehndi ceremony with bride and groom",
      photoCount: 0
    },
    {
      id: 3,
      title: "Haldi",
      date: "Feb 13, 2024",
      icon: weddingArchIcon,
      description: "Golden turmeric blessings",
      image: haldi,
      category: "haldi",
      alt: "Haldi ceremony photos",
      photoCount: 0
    },
    {
      id: 4,
      title: "Sagan",
      date: "Feb 14, 2024",
      icon: weddingRingsIcon,
      description: "Exchange promises",
      image: sagan,
      category: "sagan",
      alt: "Sagan/engagement ceremony",
      photoCount: 0
    },
    {
      id: 5,
      title: "Wedding Day",
      date: "Feb 15, 2024",
      icon: bridalIcon,
      description: "The beginning of forever",
      image: wedding,
      category: "wedding",
      alt: "Wedding day celebrations",
      photoCount: 0
    }
  ], []);

  const [events, setEvents] = useState(eventsConfig);

  // Fetch photo counts with error handling and abort controller
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchAllPhotoCounts = async () => {
      try {
        setLoading(true);
        setError(null);

        const eventsWithCounts = await Promise.all(
          eventsConfig.map(async (event) => {
            try {
              const data = await apiServices.getImagesByCategory(event.category, 1, 1);

              let photoCount = 0;
              if (Array.isArray(data)) {
                photoCount = data.length;
              } else if (data.results && Array.isArray(data.results)) {
                photoCount = data.results.length;
              } else if (data.count !== undefined) {
                photoCount = data.count;
              }

              return { ...event, photoCount };
            } catch (error) {
              if (error.name === 'AbortError') {
                throw error; // Re-throw abort error
              }
              console.warn(`Failed to fetch count for ${event.category}:`, error);
              return { ...event, photoCount: 0 };
            }
          })
        );

        if (!signal.aborted) {
          setEvents(eventsWithCounts);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return; // Component unmounted, ignore
        }
        console.error('Error in fetchAllPhotoCounts:', error);
        setError('Failed to load gallery data. Please try again.');
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAllPhotoCounts();

    return () => {
      abortController.abort();
    };
  }, [eventsConfig]);

  // GSAP Scroll Animation - Production ready
  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const sectionElement = sectionRef.current;

      // Set initial value
      sectionElement.style.setProperty('--gradient-opacity', '0');

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionElement,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1.2,
          markers: false, // Disable in production
          invalidateOnRefresh: true, // Better for responsive design
        }
      });

      timeline
        .to(sectionElement, {
          '--gradient-opacity': 1,
          duration: 2,
          ease: "power2.out",
        })
        .to(sectionElement, {
          '--gradient-opacity': 0,
          duration: 2,
          ease: "power2.in",
        });

    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleCardClick = useCallback((eventId) => {
    navigate(`/gallery/${eventId}`);
  }, [navigate]);

  const handleRetry = useCallback(() => {
    setError(null);
    // Trigger a refetch by resetting loading state
    setLoading(true);
    setTimeout(() => {
      fetchAllPhotoCounts();
    }, 100);
  }, []);

  // Re-fetch function
  const fetchAllPhotoCounts = async () => {
    try {
      const eventsWithCounts = await Promise.all(
        eventsConfig.map(async (event) => {
          try {
            const data = await apiServices.getImagesByCategory(event.category, 1, 1);

            let photoCount = 0;
            if (Array.isArray(data)) {
              photoCount = data.length;
            } else if (data.results && Array.isArray(data.results)) {
              photoCount = data.results.length;
            } else if (data.count !== undefined) {
              photoCount = data.count;
            }

            return { ...event, photoCount };
          } catch (error) {
            console.warn(`Failed to fetch count for ${event.category}:`, error);
            return { ...event, photoCount: 0 };
          }
        })
      );

      setEvents(eventsWithCounts);
    } catch (error) {
      console.error('Error in fetchAllPhotoCounts:', error);
      setError('Failed to load gallery data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Custom styled card with glassmorphism
  const EventCard = styled(Card)(({ theme }) => ({
    height: '400px',
    position: 'relative',
    border: "2px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    overflow: "hidden",
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      borderRadius: "16px",
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.5)',
      borderColor: 'rgba(255, 255, 255, 2)',
    },
  }));

  // Glassmorphism overlay for content
  const ContentOverlay = styled(Box)({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '15px',
    color: 'white',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  });

  const totalPhotos = useMemo(() =>
    events.reduce((sum, event) => sum + (event.photoCount || 0), 0),
    [events]
  );

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent'
      }}>
        <CircularProgress sx={{ color: '#FFD700' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        color: 'white',
        p: 3
      }}>
        <Alert
          severity="error"
          sx={{
            mb: 3,
            maxWidth: 500,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={handleRetry}
          sx={{
            background: 'linear-gradient(45deg, #FFD700 30%, #FFA000 90%)',
            color: 'black',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(45deg, #FFA000 30%, #FFD700 90%)',
            }
          }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box
      className="GalleryParent"
      ref={sectionRef}
      sx={{
        minHeight: '100vh',
        px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
        position: 'relative',
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            sx={{
              color: '#FFFFFF',
              fontWeight: 300,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontSize: {
                xs: '1.5rem',
                sm: '2rem',
                md: '2.5rem',
                lg: '3rem',
                xl: '3.5rem'
              },
            }}
          >
            • Capture The Love •
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              mt: 2
            }}
          >
            Click on any event to view the memories
          </Typography>
        </Box>

        {/* Event Cards Grid */}
        <Grid container spacing={3} justifyContent="center">
          {events.map(event => (
            <Grid key={event.id} size={{ xs: 12, sm: 6, md: 2, lg: 5, xl: 6 }}>
              <EventCard
                onClick={() => handleCardClick(event.id)}
                role="button"
                aria-label={`View ${event.title} gallery with ${event.photoCount} photos`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(event.id);
                  }
                }}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "85%",
                    md: "100%",
                    lg: "100%",
                    xl: "100%"
                  },
                  margin: '0 auto',
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.2)"
                }}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={event.image}
                  alt={event.alt}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    objectFit: 'cover',
                  }}
                />
                <ContentOverlay className="content-overlay">
                  {/* First row: Icon + Title */}
                  <Box display="flex" alignItems="center" gap={1.5}>
                    {/* Icon with glass background */}
                    <Box sx={{
                      p: 0.8,
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '40px',
                      minHeight: '40px'
                    }}>
                      <img
                        src={event.icon}
                        alt=""
                        width={20}
                        height={20}
                        style={{ filter: "brightness(0) invert(1)" }}
                      />
                    </Box>

                    {/* Title with glass background */}
                    <Box sx={{
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      px: 1.2,
                      py: 0.4
                    }}>
                      <Typography sx={{
                        color: "white",
                        fontWeight: "bold",
                        fontFamily: "'Playfair Display', serif",
                        fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}>
                        {event.title}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Description with glass background */}
                  <Box sx={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    px: 1.2,
                    py: 0.8,
                    alignSelf: 'flex-start',
                    maxWidth: '90%'
                  }}>
                    <Typography variant="body2" sx={{
                      opacity: 0.9,
                      fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                      lineHeight: 1.4,
                      color: 'white'
                    }}>
                      {event.description}
                    </Typography>
                  </Box>

                  {/* Chip with glass background */}
                  <Box sx={{ alignSelf: 'flex-start' }}>
                    <Chip
                      label={`${event.photoCount || 0} ${event.photoCount === 1 ? 'photo' : 'photos'}`}
                      sx={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.25)',
                        }
                      }}
                    />
                  </Box>
                </ContentOverlay>
              </EventCard>
            </Grid>
          ))}
        </Grid>

        {/* Total Photos Counter */}
        <Box textAlign="center" mt={4} color="white">
          <Typography variant="h3" fontWeight="bold">
            {totalPhotos.toLocaleString()}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8 }}>
            Precious Memories Captured
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}