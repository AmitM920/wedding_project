import React, { useEffect, memo, useRef } from 'react'
// import ProfileCard from '../ui/ProfileCardComponent'
// import ProfileCardbride from '../ui/ProfileCardComponentBride'
import './ProfileCard_section.css'

import LoveStoryTimeline from './LoveStoryTimeline';
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import Mid_compo from './Mid_compo';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const ProfileCard_section = memo(function ProfileCard_section() {
  const sectionRef = useRef(null);
  useEffect(() => {


    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom", end: "bottom 60%",
          scrub: true,
          markers: false,
        }
      });

      // 0 → 1 (first half of scroll)
      tl.to(sectionRef.current, {
        '--gradient-opacity': 1,
        duration: 0.75, // Half the total duration
        ease: "power2.out"
      })
        // 1 → 0 (second half of scroll)
        .to(sectionRef.current, {
          '--gradient-opacity': 0,
          duration: 0.75, // Half the total duration
          ease: "power2.in"
        });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className='parent_couple_card' ref={sectionRef}>
      {/* <ProfileCard
          name="Abhishek Arora"
          title=""
          handle="Software Engineer"
          status="nice"
          contactText="Contact Me"
          avatarUrl={avatarImage}
          iconUrl={iconPattern}
          grainUrl={grainTexture}
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={true}
        /> */}

      <div className='mid-content'>
        {/* <Mid_compo></Mid_compo> */}
        {/* <Embed></Embed> */}
        <LoveStoryTimeline showIcons={false} />
      </div>

      {/* <ProfileCardbride
          name="Komal Anand"
          title=""
          handle="Doctor"
          status=""
          contactText="Contact Me"
          avatarUrl={avatarImage_komal}
          iconUrl={iconPattern}
          grainUrl={grainTexture}
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={true}
        /> */}
    </div>


  )
});

export default ProfileCard_section