import React, { useState, useEffect, useCallback } from 'react';
import { HERO_IMAGES, Card_Images } from '../../../assets/config/Full_images';
import CardSwap, { Card } from '../../ui/CardSwap'
import './HeroSection.css';

const Full_HeroSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);// Tracks which image is currently showing
    const [loadedImages, setLoadedImages] = useState([]);// Stores successfully loaded images
    const [loadedCardImages, setLoadedCardImages] = useState([]); // State for card images
    const heroImages = React.useMemo(() => [

        HERO_IMAGES.PRE_WEDDING,
        HERO_IMAGES.CEREMONY
    ], []);
    // Convert Card_Images object to array for easier mapping
    // Convert Card_Images object to array
    const cardImagesArray = Object.values(Card_Images);
    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const promises = heroImages.map((image) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = image.src;
                    img.onload = () => resolve(image);
                    img.onerror = () => resolve(null);
                });
            });

            const loaded = await Promise.all(promises);
            setLoadedImages(loaded.filter(Boolean));
        };

        loadImages();
    }, []);
    // Preload card images - fixed version


    // Auto-slide every 5 seconds
    useEffect(() => {
        if (loadedImages.length === 0) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === loadedImages.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [loadedImages.length]);

    const handleDotClick = (index) => {
        setCurrentImageIndex(index);
    };

    if (loadedImages.length === 0) {
        return (
            <section className="hero-section loading">
                <div className="hero-loading">Loading precious moments...</div>
            </section>
        );
    }

    const currentImage = loadedImages[currentImageIndex];

    return (
        <section className="hero-section">
            {/* Background Images */}
            <div className="hero-background">
                {loadedImages.map((image, index) => (
                    <div
                        key={index}
                        className={`hero-bg-image ${index === currentImageIndex ? 'active' : ''
                            }`}
                        style={{ backgroundImage: `url(${image.src})` }}
                    />
                ))}
            </div>
            <div className='cardswap'>
                <CardSwap
                    cardDistance={60}
                    verticalDistance={75}
                    delay={5000}
                    pauseOnHover={false}
                >
                    {cardImagesArray.map((cardImage, index) => (
                        <Card key={index}>
                            <img
                                className='card_img'
                                src={cardImage.src}
                                alt={cardImage.alt || `Memory ${index + 1}`}
                            />
                        </Card>
                    ))}

                </CardSwap></div>
            {/* Overlay Content */}
            <div className="hero-content">
                <div className="hero-text">
                    <h1 className="hero-title">{currentImage.title}</h1>
                    <p className="hero-subtitle">Together Forever • Est. 2024</p>
                    <button className="cta-button">Our Love Story</button>
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="hero-navigation">
                {loadedImages.map((_, index) => (
                    <button
                        key={index}
                        className={`nav-dot ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <span>Scroll Down</span>
                <div className="scroll-arrow"></div>
            </div>
        </section>
    );
};

export default Full_HeroSection;