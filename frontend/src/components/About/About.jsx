import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import {
  SiReact,
  SiDjango,
  SiMui,
  SiVite,
  SiGit,
  SiGithub,
  SiVercel,
  SiPython,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiSqlite,
  SiTailwindcss
} from 'react-icons/si';
import { FaBolt } from 'react-icons/fa';

function About() {
  const techStack = [
    {
      name: 'React',
      icon: <SiReact />,
      color: '#61DAFB',
      category: 'Frontend',
      link: 'https://react.dev/'
    },
    {
      name: 'JavaScript',
      icon: <SiJavascript />,
      color: '#F7DF1E',
      category: 'Frontend',
      link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
    },
    {
      name: 'Vite',
      icon: <SiVite />,
      color: '#646CFF',
      category: 'Build Tool',
      link: 'https://vite.dev/guide/'
    },
    {
      name: 'Material-UI',
      icon: <SiMui />,
      color: '#007FFF',
      category: 'UI Library',
      link: 'https://mui.com/material-ui/'
    },
    {
      name: 'Tailwind CSS',
      icon: <SiTailwindcss />,
      color: '#06B6D4',
      category: 'CSS Framework',
      link: 'https://tailwindcss.com/'
    },
    {
      name: 'GSAP',
      icon: <FaBolt />,
      color: '#88CE02',
      category: 'Animations',
      link: 'https://gsap.com/'
    },
    {
      name: 'Django',
      icon: <SiDjango />,
      color: '#092E20',
      category: 'Backend',
      link: 'https://www.djangoproject.com/'
    },
    {
      name: 'Python',
      icon: <SiPython />,
      color: '#3776AB',
      category: 'Backend',
      link: 'https://www.python.org/'
    },
    {
      name: 'SQLite',
      icon: <SiSqlite />,
      color: '#003B57',
      category: 'Database',
      link: 'https://www.sqlite.org/'
    },
    {
      name: 'HTML5',
      icon: <SiHtml5 />,
      color: '#E34F26',
      category: 'Frontend',
      link: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
    },
    {
      name: 'CSS3',
      icon: <SiCss3 />,
      color: '#1572B6',
      category: 'Frontend',
      link: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
    },
    {
      name: 'Git',
      icon: <SiGit />,
      color: '#F05032',
      category: 'Dev Tools',
      link: 'https://git-scm.com/'
    },
    {
      name: 'GitHub',
      icon: <SiGithub />,
      color: '#FFFFFF',
      category: 'Dev Tools',
      link: 'https://github.com/'
    },
    {
      name: 'Vercel',
      icon: <SiVercel />,
      color: '#FFFFFF',
      category: 'Hosting',
      link: 'https://vercel.com/'
    },
  ];

  // Glassmorphism styles
  const glassStyles = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  };

  const lightGlass = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 20px 0 rgba(31, 38, 135, 0.2)',
  };

  const handleCardClick = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Container maxWidth="lg" sx={{
      py: 8,
      color: 'white',
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 139, 0.15) 0%, transparent 50%)',
    }}>
      {/* Header with glass effect */}
      <Box textAlign="center" mb={6} sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 4,
        ...glassStyles,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      }}>
        <Typography variant="h2" sx={{
          mb: 2,
          fontWeight: 800,
          background: 'linear-gradient(45deg, #FF6B8B, #FFD166, #06B6D4, #06D6A0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: {
            xs: '2rem',
            sm: '2.5rem',
            md: '3rem',
            lg: '3.5rem'
          }
        }}>
          💻 Tech Stack
        </Typography>
        <Typography variant="h5" sx={{
          opacity: 0.9,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: {
            xs: '1rem',
            sm: '1.25rem',
            md: '1.5rem',
            lg: '1.75rem'
          }
        }}>
          Technologies powering this wedding website
        </Typography>
      </Box>

      {/* Divider with glass effect */}
      <Box sx={{
        my: 4,
        py: 1,
        borderRadius: 2,
        ...lightGlass,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      }}>
        <Divider sx={{
          bgcolor: 'rgba(255,255,255,0.1)',
          height: '1px',
          border: 'none'
        }} />
      </Box>

      {/* Tech Stack Grid */}
      <Box sx={{ mb: 8 }}>
        <Grid container spacing={2} justifyContent="center">
          {techStack.map((tech, index) => (
            <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <Paper
                onClick={() => handleCardClick(tech.link)}
                sx={{
                  p: { xs: 1, sm: 1.5, md: 2 },
                  textAlign: 'center',
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${tech.color}15, transparent 70%)`,
                    borderRadius: 3,
                    zIndex: 0,
                  },
                  ...glassStyles,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 20px 40px 0 rgba(31, 38, 135, 0.5), 0 0 20px ${tech.color}40`,
                    borderColor: `${tech.color}80`,
                    '&::before': {
                      background: `linear-gradient(135deg, ${tech.color}30, transparent 50%)`,
                    }
                  }
                }}
                component="div"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(tech.link);
                  }
                }}
                aria-label={`Learn more about ${tech.name} (opens in new tab)`}
              >
                <Box sx={{
                  fontSize: {
                    xs: '1.5rem',
                    sm: '2rem',
                    md: '2.25rem',
                    lg: '2.5rem'
                  },
                  mb: { xs: 0.5, sm: 1 },
                  color: tech.color,
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}>
                  {tech.icon}
                </Box>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: 'white',
                  position: 'relative',
                  zIndex: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                    md: '1.125rem',
                    lg: '1.25rem'
                  }
                }}>
                  {tech.name}
                </Typography>
                <Chip
                  label={tech.category}
                  size="small"
                  sx={{
                    mt: { xs: 0.5, sm: 1 },
                    position: 'relative',
                    zIndex: 1,
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontWeight: 500,
                    fontSize: {
                      xs: '0.625rem',
                      sm: '0.75rem'
                    },
                    height: { xs: 20, sm: 24 },
                    '&:hover': {
                      background: 'rgba(255,255,255,0.25)',
                    }
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer with enhanced glass effect */}
      <Box sx={{
        mt: 8,
        p: { xs: 2, sm: 3, md: 4 },
        textAlign: 'center',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,107,139,0.1), rgba(255,209,102,0.1), rgba(6,182,212,0.1), rgba(6,214,160,0.1))',
          borderRadius: 4,
          zIndex: 0,
        },
        ...glassStyles,
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.3)',
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h5" sx={{
            mb: 2,
            color: 'white',
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            background: 'linear-gradient(90deg, #FFD700, #FF6B8B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            fontSize: {
              xs: '1.25rem',
              sm: '1.5rem',
              md: '1.75rem',
              lg: '2rem'
            }
          }}>
            Built with modern web technologies
          </Typography>
          <Typography variant="body1" sx={{
            opacity: 0.95,
            color: 'white',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.7,
            fontSize: {
              xs: '0.875rem',
              sm: '0.95rem',
              md: '1rem',
              lg: '1.05rem'
            }
          }}>
            This wedding website showcases a modern full-stack application
            with Django backend and React frontend, using Material-UI and Tailwind CSS for styling.
          </Typography>
          {/* Subtle gradient accent */}
          <Box sx={{
            width: '100px',
            height: '4px',
            background: 'linear-gradient(90deg, #FF6B8B, #FFD166, #06B6D4)',
            borderRadius: '2px',
            mx: 'auto',
            mt: 3,
            opacity: 0.7
          }} />
        </Box>
      </Box>

      {/* Background decorative elements */}
      <Box sx={{
        position: 'fixed',
        top: '20%',
        right: '10%',
        width: { xs: '150px', sm: '200px', md: '250px', lg: '300px' },
        height: { xs: '150px', sm: '200px', md: '250px', lg: '300px' },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,139,0.1) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: -1,
      }} />
      <Box sx={{
        position: 'fixed',
        bottom: '20%',
        left: '10%',
        width: { xs: '100px', sm: '150px', md: '180px', lg: '200px' },
        height: { xs: '100px', sm: '150px', md: '180px', lg: '200px' },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
        filter: 'blur(30px)',
        zIndex: -1,
      }} />
    </Container>
  );
}

export default About;