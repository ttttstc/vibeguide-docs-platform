'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MoreHorizontal, FileText, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Project } from '@vibeguide/shared-types';

interface ProjectCardProps {
  project: Project & { documents?: any[] };
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onView?: (projectId: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete, onView }: ProjectCardProps) {
  const documentCount = project.documents?.length || 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(project._id)}>
              <FileText className="mr-2 h-4 w-4" />
              View Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(project)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete?.(project._id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {documentCount} document{documentCount !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="text-sm text-gray-500">
            Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
          </div>
        </div>
        <div className="mt-4">
          <Button 
            onClick={() => onView?.(project._id)}
            className="w-full"
            variant="outline"
          >
            <FileText className="mr-2 h-4 w-4" />
            Manage Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}