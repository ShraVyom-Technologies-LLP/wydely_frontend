import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Project } from '../utils/types';
import { apiService } from '../services/api';
import { useApiCall } from '../hooks/useApiCall';

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  refreshProjects: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ProjectContext = createContext<ProjectState | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from API
  const fetchProjects = useApiCall(() => apiService.getProjects(), {
    showErrorToast: true,
    errorMessage: 'Failed to load projects',
    onSuccess: (data) => {
      if (data) {
        console.log('projects fetched data', data);
        setProjects(data);
        // Auto-select first project if none selected and projects exist
        if (!selectedProject && data.length > 0) {
          setSelectedProject(data[0]);
        }
      }
    },
  });

  // Helper function to check if current path is an auth page
  const isAuthPage = (): boolean => {
    if (typeof window === 'undefined') {
      // For React Native, we can't check the path easily
      // Return false to allow fetching (React Native navigation handles routing differently)
      return false;
    }
    const path = window.location.pathname;
    const authPaths = ['/login', '/signup', '/otp'];
    return authPaths.some((authPath) => path.startsWith(authPath));
  };

  // Fetch projects on mount if NOT on auth pages
  // This ensures projects are loaded when refreshing protected pages
  useEffect(() => {
    if (!isAuthPage()) {
      fetchProjects.execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchProjects.execute();
      if (result) {
        setProjects(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist selected project to localStorage (for web)
  useEffect(() => {
    if (selectedProject && typeof window !== 'undefined') {
      localStorage.setItem('selectedProjectId', selectedProject.id);
    }
  }, [selectedProject]);

  // Restore selected project from localStorage (for web)
  useEffect(() => {
    if (typeof window !== 'undefined' && projects.length > 0 && !selectedProject) {
      const savedProjectId = localStorage.getItem('selectedProjectId');
      if (savedProjectId) {
        const project = projects.find((p) => p.id === savedProjectId);
        if (project) {
          setSelectedProject(project);
        } else if (projects.length > 0) {
          // If saved project not found, select first one
          setSelectedProject(projects[0]);
        }
      } else if (projects.length > 0) {
        // No saved project, select first one
        setSelectedProject(projects[0]);
      }
    }
  }, [projects, selectedProject]);

  const value: ProjectState = {
    projects,
    selectedProject,
    setSelectedProject,
    refreshProjects,
    isLoading: fetchProjects.isLoading || isLoading,
    error: error || (fetchProjects.error ? String(fetchProjects.error) : null),
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};
