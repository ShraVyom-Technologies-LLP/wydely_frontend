import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Project } from '../utils/types';
import { apiService } from '../services/api';
import { useApiCall } from '../hooks/useApiCall';
import { useAuth } from './AuthContext';
import { navigationRef } from '../navigation/AppNavigator';

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
  const { isAuthenticated, isLoading: authLoading } = useAuth();

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
      // For React Native, check navigation state
      if (navigationRef.isReady()) {
        const currentRoute = navigationRef.getCurrentRoute();
        return (
          currentRoute?.name === 'Login' ||
          currentRoute?.name === 'SignUp' ||
          currentRoute?.name === 'OTP'
        );
      }
      return false;
    }
    const path = window.location.pathname;
    const authPaths = ['/login', '/signup', '/otp'];
    return authPaths.some((authPath) => path.startsWith(authPath));
  };

  // Fetch projects when user becomes authenticated and is not on auth pages
  // This ensures projects are loaded after login
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Only fetch if authenticated
    if (isAuthenticated) {
      // Check if we're on an auth page - if so, don't fetch yet
      // The projects will be fetched when user navigates away from auth pages
      if (isAuthPage()) {
        return;
      }

      // Only fetch if we don't already have projects (to avoid unnecessary calls)
      if (projects.length === 0 && !fetchProjects.isLoading) {
        fetchProjects.execute();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  // Listen to navigation state changes to fetch projects when navigating to Projects page
  // This handles the case when user logs in and immediately navigates to Projects
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const checkAndFetch = () => {
        // Wait for navigation to be ready
        if (!navigationRef.isReady()) {
          return;
        }

        const currentRoute = navigationRef.getCurrentRoute();
        const isOnProjectsPage = currentRoute?.name === 'Projects';
        const isOnAuthPage =
          currentRoute?.name === 'Login' ||
          currentRoute?.name === 'SignUp' ||
          currentRoute?.name === 'OTP';

        // If we're on Projects page, authenticated, and don't have projects, fetch them
        if (
          isOnProjectsPage &&
          !isOnAuthPage &&
          projects.length === 0 &&
          !fetchProjects.isLoading
        ) {
          fetchProjects.execute();
        }
      };

      // Check immediately
      checkAndFetch();

      // Poll every 200ms for a short period to catch navigation changes
      // This ensures we catch the navigation even if it happens slightly after authentication
      const intervalId = setInterval(checkAndFetch, 200);
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, 2000); // Stop polling after 2 seconds

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

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
