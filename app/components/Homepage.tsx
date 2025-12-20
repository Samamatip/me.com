import React from 'react'
import Hero from './Hero';
import SkillsCarrousel from './SkillsCarrousel';
import Background from './Background';
import ProjectsOverview from './ProjectsOverview';
import Contact from './Contact';
import { useProfile } from '../contexts/profileContext';

const Homepage = () => {
  const { profile } = useProfile();

  // Show a loading state while profile data is being fetched to ensure all components have the necessary data
  if (
    !profile ||
    !profile.name ||
    !profile.summary ||
    !profile.background ||
    !profile.email
  ) {
    return <div>Loading...</div>;
  }

  return (
    <main className=''>
        <div id='skills'><SkillsCarrousel /></div>
        <div id='hero'><Hero /></div>
        <div id='about'><Background /></div>
        <div id='projects'><ProjectsOverview /></div>
        <div id='contact'><Contact /></div>
    </main>
  )
}

export default Homepage;