'use client';
import React from 'react';
import ProjectsCards from './ProjectsCards';
import { useProfile } from '../contexts/profileContext';

const ProjectsOverview = () => {
    const { profile } = useProfile();
    const items = profile?.projects;

    //get the first 3 items
    const firstThreeItems = items ? items.slice(0, 3) : null;

    
  return (
  <>
    <ProjectsCards items={firstThreeItems} noSeeAll={false} />
  </>
  )
}

export default ProjectsOverview;