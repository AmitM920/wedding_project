import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Button,
  Avatar
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
  SiTailwindcss,
  SiLinkedin,
  SiGmail
} from 'react-icons/si';
import { FaBolt, FaChevronDown, FaUser } from 'react-icons/fa';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

function About() {
  const [techStackOpen, setTechStackOpen] = useState(false);
  const [aboutDevOpen, setAboutDevOpen] = useState(false);

  const techStack = [
    { name: 'React', icon: <SiReact />, color: '#61DAFB', link: 'https://react.dev/' },
    { name: 'JavaScript', icon: <SiJavascript />, color: '#F7DF1E', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { name: 'Vite', icon: <SiVite />, color: '#646CFF', link: 'https://vite.dev/guide/' },
    { name: 'Material-UI', icon: <SiMui />, color: '#007FFF', link: 'https://mui.com/material-ui/' },
    { name: 'Tailwind CSS', icon: <SiTailwindcss />, color: '#06B6D4', link: 'https://tailwindcss.com/' },
    { name: 'GSAP', icon: <FaBolt />, color: '#88CE02', link: 'https://gsap.com/' },
    { name: 'Django', icon: <SiDjango />, color: '#092E20', link: 'https://www.djangoproject.com/' },
    { name: 'Python', icon: <SiPython />, color: '#3776AB', link: 'https://www.python.org/' },
    { name: 'SQLite', icon: <SiSqlite />, color: '#003B57', link: 'https://www.sqlite.org/' },
    { name: 'HTML5', icon: <SiHtml5 />, color: '#E34F26', link: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
    { name: 'CSS3', icon: <SiCss3 />, color: '#1572B6', link: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
    { name: 'Git', icon: <SiGit />, color: '#F05032', link: 'https://git-scm.com/' },
    { name: 'GitHub', icon: <SiGithub />, color: '#FFFFFF', link: 'https://github.com/' },
    { name: 'Vercel', icon: <SiVercel />, color: '#FFFFFF', link: 'https://vercel.com/' },
  ];

  const glassStyles = {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const handleCardClick = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleContact = (type, value) => {
    if (type === 'email') {
      window.location.href = `mailto:${value}`;
    } else if (type === 'linkedin') {
      window.open(value, '_blank', 'noopener,noreferrer');
    } else if (type === 'github') {
      window.open(value, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Container maxWidth="md" sx={{
      py: 4,
      color: 'white',
      minHeight: '100vh',
    }}>
      
      {/* Main Header */}
      <Box textAlign="center" mb={4} sx={{
        p: 3,
        borderRadius: 2,
        ...glassStyles,
      }}>
        <Typography variant="h4" sx={{
          mb: 1,
          fontWeight: 600,
          color: 'white',
          fontSize: '1.5rem',
        }}>
          About
        </Typography>
        <Typography variant="body1" sx={{
          opacity: 0.9,
          color: 'white',
          fontSize: '0.875rem',
        }}>
          Discover the technologies and developer behind this wedding website
        </Typography>
      </Box>

      {/* TechStack Section */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => setTechStackOpen(!techStackOpen)}
          startIcon={techStackOpen ? <MdExpandLess /> : <MdExpandMore />}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '0.875rem',
            width: '100%',
            mb: 2,
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }
          }}
        >
          TechStack Used in this Project
        </Button>

        <Collapse in={techStackOpen} timeout={300}>
          <Box sx={{
            p: 2,
            borderRadius: 1,
            ...glassStyles,
          }}>
            <List dense>
              {techStack.map((tech, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    button 
                    onClick={() => handleCardClick(tech.link)}
                    sx={{
                      px: 1,
                      py: 0.5,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      }
                    }}
                  >
                    <ListItemText 
                      primary={tech.name}
                      primaryTypographyProps={{
                        fontSize: '0.75rem',
                        color: 'white',
                        fontWeight: 400,
                      }}
                    />
                    <ListItemIcon sx={{ 
                      minWidth: 'auto',
                      ml: 1,
                      color: tech.color,
                      filter: 'grayscale(100%) brightness(2)'
                    }}>
                      {tech.icon}
                    </ListItemIcon>
                  </ListItem>
                  {index < techStack.length - 1 && (
                    <Divider sx={{ 
                      my: 0.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)' 
                    }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Collapse>
      </Box>

      {/* About Developer Section */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => setAboutDevOpen(!aboutDevOpen)}
          startIcon={<FaUser />}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '0.875rem',
            width: '100%',
            mb: 2,
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }
          }}
        >
          About Developer
        </Button>

        <Collapse in={aboutDevOpen} timeout={300}>
          <Box sx={{
            p: 2,
            borderRadius: 1,
            ...glassStyles,
          }}>
            {/* Developer Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  mr: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <FaUser size="60%" />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500, fontSize: '0.875rem' }}>
                  Amit Mehta
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem' }}>
                  Full Stack Developer
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ 
              my: 1.5,
              backgroundColor: 'rgba(255, 255, 255, 0.1)' 
            }} />

            {/* Contact Buttons */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                size="small"
                startIcon={<SiGmail />}
                onClick={() => handleContact('email', 'amitmehta9202000@gmail.com')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1,
                  minWidth: 'auto',
                  flex: 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
                variant="outlined"
              >
                Email
              </Button>
              
              <Button
                size="small"
                startIcon={<SiLinkedin />}
                onClick={() => handleContact('linkedin', 'https://www.linkedin.com/in/amit-mehta369/')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1,
                  minWidth: 'auto',
                  flex: 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
                variant="outlined"
              >
                LinkedIn
              </Button>
              
              <Button
                size="small"
                startIcon={<SiGithub />}
                onClick={() => handleContact('github', 'https://github.com/AmitM920')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  py: 0.5,
                  px: 1,
                  minWidth: 'auto',
                  flex: 1,
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
                variant="outlined"
              >
                GitHub
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Background blur effect */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(0.2px)',
        zIndex: -1,
      }} />
    </Container>
  );
}

export default About;