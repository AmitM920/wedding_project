import React, { useEffect } from 'react'
import ProfileCard from '../ui/ProfileCardComponent'
import ProfileCardbride from '../ui/ProfileCardComponentBride'
import './ProfileCard_section.css'
import avatarImage from "../../assets/demo/abhi-bg_imgupscaler.ai_V1(Fast)_2K.png";
import avatarImage_komal from '../../assets/demo/k_2 -bg.png'
import iconPattern from "../../assets/demo/iconpattern.png";
import grainTexture from "../../assets/demo/grain.webp";
import Mid_compo from './Mid_compo';

function ProfileCard_section() {
  useEffect(() => {
    console.log('ProfileCard_section rendered');
  });
  return (
    <div className='parent_couple_card'>
      <ProfileCard
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
      />

      <div className='mid-content'>
        <Mid_compo></Mid_compo>
      </div>

      <ProfileCardbride
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
      />
    </div>
  )
}

export default ProfileCard_section