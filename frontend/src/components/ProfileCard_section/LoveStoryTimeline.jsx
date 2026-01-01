import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import './ProfileCard_section.css';
import { observeElements } from '../../assets/config/animation'

// Import MUI icons for the story
import ComputerIcon from '@mui/icons-material/Computer';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CelebrationIcon from '@mui/icons-material/Celebration';
import DiamondIcon from '@mui/icons-material/Diamond';
import HeartBrokenIcon from '@mui/icons-material/FavoriteBorder';
import CoffeeIcon from '@mui/icons-material/Coffee';
import FlightIcon from '@mui/icons-material/Flight';
import HomeIcon from '@mui/icons-material/Home';
import { useEffect } from 'react';

export default function LoveStoryTimeline({ showIcons = true }) {
    // Love story events with dates and details
    const loveStoryEvents = [
        {
            id: 1,
            date: "Dec 28, 2024",
            title: "The Digital Interest",
            description: "Jeevansaathi request sent.",
            icon: <ComputerIcon />,
            color: "primary",
            hasOpposite: true
        },
        {
            id: 2,
            date: "Dec 29, 2024",
            title: "Exchange Of Messages",
            description: "First digital interaction.",
            icon: <RestaurantIcon />,
            color: "secondary",
            hasOpposite: true
        },
        {
            id: 3,
            date: "Jan 23, 2025",
            title: "Smile Through Pixels",
            description: "A video call in between two soul.",
            icon: <PeopleIcon />,
            color: "success",
            hasOpposite: true
        },
        {
            id: 4,
            date: "June 5, 2025",
            title: "Hello in HD",
            description: "Meeting in person at shipra mall.",
            icon: <FlightIcon />,
            color: "warning",
            hasOpposite: true
        },
        {
            id: 5,
            date: "July 15, 2022",
            title: "The Family Council",
            description: "Family introduction.",
            icon: <DiamondIcon />,
            color: "error",
            hasOpposite: true
        },
        {
            id: 6,
            date: "February 23, 2025",
            title: "The Foundation Meeting",
            description: "First official meeting.",
            icon: <FavoriteIcon />,
            color: "primary",
            variant: "outlined",
            hasOpposite: true
        },
        {
            id: 6,
            date: "Nov 24, 2025",
            title: "The Grand Day",
            description: "The Wedding Day.",
            icon: <FavoriteIcon />,
            color: "primary",
            variant: "outlined",
            hasOpposite: true
        }
    ];

    // Initialize animations when component mounts
    useEffect(() => {
        // Add animation to each timeline item
        observeElements('.timeline-item', (element) => {
            // You can add custom logic here if needed

        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        // Also observe connectors for separate animation
        observeElements('.timeline-connector', null, {
            threshold: 0.3
        });

        // Also observe dots for separate animation
        observeElements('.timeline-dot', null, {
            threshold: 0.3
        });
    }, []);


    // Helper to get connector color
    const getConnectorColor = (index) => {
        const colors = ['primary.main', 'secondary.main', 'success.main', 'warning.main', 'error.main', 'info.main', 'primary.main'];
        return colors[index % colors.length];
    };

    return (<div style={{ opacity: 1, visibility: 'visible' }}>
        <Typography
            variant="h2"
            align="center"
            sx={{
                mb: -2,
                color: '#FFFFFF',
                fontWeight: 300,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontSize: {
                    xs: '1.5rem',    // Mobile: ~24px
                    sm: '2rem',      // Small: ~32px
                    md: '2.5rem',    // Medium: ~40px
                    lg: '3rem',      // Large: ~48px
                    xl: '3.5rem'     // Extra large: ~56px
                },
            }}
        >
            • How We Met •
        </Typography>
        <Timeline position="alternate" sx={{
            padding: 0, margin: 0,
            '& .MuiTimelineItem-root': {
                minHeight: '120px',
                alignItems: 'center',
            }
        }}>
            {loveStoryEvents.map((event, index) => (
                <TimelineItem key={event.id} className="timeline-item">
                    <TimelineOppositeContent
                        sx={{
                            m: 'auto 0',
                            textAlign: index % 2 === 0 ? 'right' : 'left',
                            pr: index % 2 === 0 ? 3 : 2,
                            pl: index % 2 === 0 ? 2 : 3
                        }}
                        variant="body2"
                    >
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#969696' }}>
                            {event.date}
                        </Typography>
                    </TimelineOppositeContent>

                    <TimelineSeparator>
                        {/* Connector FROM previous dot */}
                        <TimelineConnector sx={{
                            bgcolor: index === 0 ? 'transparent' : getConnectorColor(index - 1),
                            height: '80px',
                            width: '2px'
                        }} />

                        <TimelineDot
                            className="timeline-dot"
                            color={event.color}
                            variant={event.variant || "filled"}
                            sx={{
                                boxShadow: 3,
                                border: showIcons ? 'none' : '2px solid',
                                ...(event.color === 'primary' && { borderColor: 'primary.main' }),
                                ...(event.color === 'secondary' && { borderColor: 'secondary.main' })
                            }}
                        >
                            {showIcons ? event.icon : null}
                        </TimelineDot>

                        {/* Connector TO next dot */}
                        <TimelineConnector sx={{
                            bgcolor: index === loveStoryEvents.length - 1 ? 'transparent' : getConnectorColor(index),
                            height: '80px',
                            width: '2px'
                        }} />
                    </TimelineSeparator>

                    <TimelineContent className="timeline-content" sx={{
                        py: '20px',
                        px: 2,
                        textAlign: index % 2 === 0 ? 'left' : 'right'
                    }}>
                        <Typography variant="h6" component="span" fontWeight="bold" sx={{ color: '#DBDBDB' }}>
                            {event.title}
                        </Typography>

                        <Typography variant="body2" sx={{
                            mt: 1,
                            color: '#969696',
                            fontStyle: 'italic'
                        }}>
                            {event.description}
                        </Typography>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    </div>
    );
}

// Alternative: Simple version without icons
export function SimpleLoveStoryTimeline() {
    const simpleEvents = [
       {
            id: 1,
            date: "Dec 28, 2024",
            title: "The Digital Interest",
            description: "Jeevansaathi request sent.",
            icon: <ComputerIcon />,
            color: "primary",
            hasOpposite: true
        },
        {
            id: 2,
            date: "Dec 29, 2024",
            title: "Exchange Of Messages",
            description: "First digital interaction.",
            icon: <RestaurantIcon />,
            color: "secondary",
            hasOpposite: true
        },
        {
            id: 3,
            date: "Jan 23, 2025",
            title: "Smile Through Pixels",
            description: "A video call in between two soul.",
            icon: <PeopleIcon />,
            color: "success",
            hasOpposite: true
        },
        {
            id: 4,
            date: "June 5, 2025",
            title: "Hello in HD",
            description: "Meeting in person at shipra mall.",
            icon: <FlightIcon />,
            color: "warning",
            hasOpposite: true
        },
        {
            id: 5,
            date: "July 15, 2022",
            title: "The Family Council",
            description: "Family introduction.",
            icon: <DiamondIcon />,
            color: "error",
            hasOpposite: true
        },
        {
            id: 6,
            date: "February 23, 2025",
            title: "The Foundation Meeting",
            description: "First official meeting.",
            icon: <FavoriteIcon />,
            color: "primary",
            variant: "outlined",
            hasOpposite: true
        },
        {
            id: 6,
            date: "Nov 24, 2025",
            title: "The Grand Day",
            description: "The Wedding Day.",
            icon: <FavoriteIcon />,
            color: "primary",
            variant: "outlined",
            hasOpposite: true
        }
    ];

    return (
        <Timeline position="alternate">
            {simpleEvents.map((event, index) => (
                <TimelineItem key={index}>
                    <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        align="right"
                        variant="body2"
                        color="text.secondary"
                    >
                        {event.date}
                    </TimelineOppositeContent>

                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot
                            sx={{
                                bgcolor: 'primary.main',
                                width: 16,
                                height: 16
                            }}
                        />
                        <TimelineConnector />
                    </TimelineSeparator>

                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span" color="primary">
                            {event.title}
                        </Typography>
                        <Typography variant="body2">
                            {event.description}
                        </Typography>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}