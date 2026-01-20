import React from 'react';
import ProjectsPage from './ProjectsPage';

export default function ProjectsPageWrapper() {
  // ProjectProvider is now at App level, so we don't need it here
  return <ProjectsPage />;
}
