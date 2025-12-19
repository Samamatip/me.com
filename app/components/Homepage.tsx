import React from 'react'
import Hero from './Hero';
import SkillsCarrousel from './SkillsCarrousel';
import Background from './Background';
import ProjectsOverview from './ProjectsOverview';
import Contact from './Contact';

const Homepage = () => {
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