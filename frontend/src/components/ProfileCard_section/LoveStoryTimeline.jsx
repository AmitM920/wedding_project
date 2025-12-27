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
            date: "March 15, 2022",
            title: "The Digital Connection",
            description: "Met through a mutual friend on Instagram. First message: 'Hey, I think we have a friend in common!'",
            icon: <ComputerIcon />,
            color: "primary",
            hasOpposite: true
        },
        {
            id: 2,
            date: "April 10, 2022",
            title: "First Date at Café Royale",
            description: "Met at the mall's coffee shop. Conversation flowed for 3 hours over cappuccinos and pastries.",
            icon: <RestaurantIcon />,
            color: "secondary",
            hasOpposite: true
        },
        {
            id: 3,
            date: "May 20, 2022",
            title: "Family Introduction",
            description: "Her parents visited our home. Traditional sweets were exchanged, and blessings were given.",
            icon: <PeopleIcon />,
            color: "success",
            hasOpposite: true
        },
        {
            id: 4,
            date: "June 5, 2022",
            title: "Romantic Getaway",
            description: "Weekend trip to the mountains. Watched sunrise together, promising forever.",
            icon: <FlightIcon />,
            color: "warning",
            hasOpposite: true
        },
        {
            id: 5,
            date: "July 15, 2022",
            title: "The Proposal",
            description: "Under the stars with family and friends. He got down on one knee with a ring.",
            icon: <DiamondIcon />,
            color: "error",
            hasOpposite: true
        },
        {
            id: 6,
            date: "February 15, 2024",
            title: "Wedding Day",
            description: "The beginning of our forever journey as husband and wife.",
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
            date: "March 2022",
            title: "Online Meeting",
            description: "Connected through social media"
        },
        {
            date: "April 2022",
            title: "First Date",
            description: "Coffee shop meeting that lasted hours"
        },
        {
            date: "May 2022",
            title: "Family Meets",
            description: "Parents blessed our relationship"
        },
        {
            date: "July 2022",
            title: "Engagement",
            description: "Official promise to marry"
        },
        {
            date: "Feb 2024",
            title: "Wedding",
            description: "Lifelong commitment begins"
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