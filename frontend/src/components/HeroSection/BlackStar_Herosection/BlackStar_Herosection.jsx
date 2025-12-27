import React, { memo } from 'react';
import { useRef, useState, useCallback, useMemo } from "react";

import { HERO_IMAGES, Card_Images } from '../../../assets/config/Full_images';
import CardSwap, { Card } from '../../ui/CardSwap'
import './BlackStar_Herosection.css';



const Full_HeroSection = memo(() => {
    const heroImage = HERO_IMAGES.PRE_WEDDING; // Choose one image
    const cardImagesArray = Object.values(Card_Images);

    return (
        <section className="hero-section">
            {/* Single Background Image */}
            <div className="hero-background">
                {/* <img
                    className="hero-bg-image"
                    src={heroImage.src}
                    alt={heroImage.title}
                    fetchPriority="high"
                    loading="eager"

                /> */}
                {/* <Particles /> */}
            </div>

            {/* CardSwap */}
            {/* <AnimatedContent
                distance={150}
                direction="horizontal"
                reverse={false}
                duration={1.2}
                ease="bounce.out"
                initialOpacity={0.2}
                animateOpacity
                scale={1.1}
                threshold={0.2}
                delay={0.3}
                className='cardswap'
            > */}
            <div className='cardswap'>
                <CardSwap
                    cardDistance={60}
                    verticalDistance={75}
                    delay={5000}
                    pauseOnHover={false}
                >
                    {cardImagesArray.map((cardImage, index) => (
                        <Card key={cardImage.src}>
                            <img
                                className='card_img'
                                src={cardImage.src}
                                alt={cardImage.alt || `Memory ${index + 1}`}
                                loading="lazy"
                                width="300"
                                height="400"
                            />
                        </Card>
                    ))}
                </CardSwap>
            </div>
            {/* </AnimatedContent> */}
            {/* Overlay Content */}
            <div className="hero-content">
                <div className="hero-text">
                    <h1 className="hero-title">{heroImage.title}</h1>
                    <p className="hero-subtitle">• Together Forever • </p>

                    <button className="cta-button">Scroll Story</button>

                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
                <span>Scroll Down</span>
                <div className="scroll-arrow"></div>
            </div>
        </section>
    );
});

export default Full_HeroSection;