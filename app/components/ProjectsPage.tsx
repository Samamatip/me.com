'use client';
import React from 'react';
import ProjectsCards from './ProjectsCards';
import { useProfile } from '../contexts/profileContext';

const Projects = () => {
  const { profile } = useProfile();


  return (
    <div>
      <ProjectsCards items={profile?.projects ?? null} noSeeAll={true} />
    </div>
  )
}

export default Projects;    