'use client';

import { useEffect, useState } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { ProjectList } from '@/components/ProjectList';
import { DocEditor } from '@/components/DocEditor';
import { apiClient } from '@/lib/api';
import { Project } from '@vibeguide/shared-types';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'project'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.setToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleProjectSelect = (projectId: string) => {
    // Fetch project details
    apiClient.get(`/api/projects/${projectId}`)
      .then(response => {
        setSelectedProject(response.data.data.project);
        setCurrentView('project');
      })
      .catch(error => {
        console.error('Failed to fetch project:', error);
      });
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProject(null);
  };

  if (!isAuthenticated) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  if (currentView === 'project' && selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleBackToDashboard}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Back to Projects
          </button>
          <DocEditor projectId={selectedProject._id} project={selectedProject} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ProjectList onProjectSelect={handleProjectSelect} />
      </div>
    </div>
  );
}