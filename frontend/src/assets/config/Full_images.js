// Import your actual images

import pre_wedding from '../images/hero/pre-wedding_full.webp';
import ceremony from '../images/hero/ceremony_full.webp';
// Import card images directly
import card1 from '../images/hero/card-pics/1.webp';
import card3 from '../images/hero/card-pics/3.webp';
import card2 from '../images/hero/card-pics/2.webp';
import card4 from '../images/hero/card-pics/4.webp';
import card5 from '../images/hero/card-pics/5.webp';


// Hero Section Images
export const HERO_IMAGES = {

    PRE_WEDDING: {
        src: pre_wedding,
        alt: 'Pre-Wedding Photos',
        title: 'Abhishek  &  Komal  '
    },
    CEREMONY: {
        src: ceremony,
        alt: 'Wedding Ceremony',
        title: 'Love in Every Frame'
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

}
// Export all images for easy access
export const ALL_IMAGES = {
    ...HERO_IMAGES,
    ...SECTION_IMAGES,
    ...Card_Images,
};