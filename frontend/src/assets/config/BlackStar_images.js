// Import your actual images

import pre_wedding from '../images/hero/pre-wedding.png';
import ceremony from '../images/hero/ceremony.png';
// Import card images directly
import card1 from '../images/hero/card-pics/1.JPG';
import card2 from '../images/hero/card-pics/2.JPG';
import card3 from '../images/hero/card-pics/3.JPG';
import card4 from '../images/hero/card-pics/4.JPG';
import card5 from '../images/hero/card-pics/5.JPG';
import card6 from '../images/hero/card-pics/6.JPG';

// Hero Section Images
export const HERO_IMAGES = {

    PRE_WEDDING: {
        src: pre_wedding,
        alt: 'Pre-Wedding Photos',
        title: 'Love in Every Frame'
    },
    CEREMONY: {
        src: ceremony,
        alt: 'Wedding Ceremony',
        title: 'Our Special Day'
    }
};

// Section Images
export const SECTION_IMAGES = {
    VENUE: {
        src: '/assets/images/sections/venue.jpg',
        alt: 'Wedding Venue'
    },
    RITUALS: {
        src: '/assets/images/sections/rituals.jpg',
        alt: 'Traditional Rituals'
    }
};

// Card pics
export const Card_Images = {
    1: {
        src: card1,
    },
    2: {
        src: card2
    },
    3: {
        src: card3
    },
    4: {
        src: card4
    },
    5: {
        src: card5
    },
    6: {
        src: card6
    }
}
// Export all images for easy access
export const ALL_IMAGES = {
    ...HERO_IMAGES,
    ...SECTION_IMAGES,
    ...Card_Images,
};