'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Loader2, FileText, Download, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { Document, Project } from '@vibeguide/shared-types';

interface DocEditorProps {
  projectId: string;
  project?: Project;
}

export function DocEditor({ projectId, project }: DocEditorProps) {
  const [activeTab, setActiveTab] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state for document generation
  const [docForm, setDocForm] = useState({
    title: '',
    audience: 'developers',
    tone: 'professional',
    specifications: '',
  });

  // Query for project documents
  const { data: documentsData, isLoading: docsLoading } = useQuery({
    queryKey: ['project-documents', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/projects/${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
  });

  // Mutation for generating documents
  const generateDocMutation = useMutation({
    mutationFn: async (docData: typeof docForm) => {
      const response = await apiClient.post('/api/generate-doc', {
        ...docData,
        projectId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['project-documents', projectId] });
      setDocForm({ title: '', audience: 'developers', tone: 'professional', specifications: '' });
      setActiveTab('documents');
      toast({
        title: 'Document generated',
        description: `Successfully generated "${data.data.document.title}"`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Generation failed',
        description: error.response?.data?.error || 'Failed to generate document',
        variant: 'destructive',
      });
    },
  });

  // Mutation for deleting documents
  const deleteDocMutation = useMutation({
    mutationFn: async (docId: string) => {
      await apiClient.delete(`/api/generate-doc/${docId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-documents', projectId] });
      toast({
        title: 'Document deleted',
        description: 'Document has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete document',
        description: error.response?.data?.error || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const handleGenerateDocument = () => {
    if (!docForm.title.trim() || !docForm.specifications.trim()) {
      toast({
        title: 'Validation error',
        description: 'Please fill in title and specifications',
        variant: 'destructive',
      });
      return;
    }
    generateDocMutation.mutate(docForm);
  };

  const handleDeleteDocument = (docId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocMutation.mutate(docId);
    }
  };

  const documents = documentsData?.data?.documents || [];

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering (you might want to use a proper markdown library)
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mt-3 mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium mt-2 mb-1">{line.slice(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4">{line.slice(2)}</li>;
        }
        if (line.startsWith('```')) {
          return <code key={index} className="block bg-gray-100 p-2 rounded text-sm font-mono">{line.slice(3)}</code>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="mb-2">{line}</p>;
      });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{project?.name}</h1>
        <p className="text-gray-600">{project?.description}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="generate">Generate Documentation</TabsTrigger>
          <TabsTrigger value="documents">
            Documents ({documents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate AI Documentation</CardTitle>
              <CardDescription>
                Use AI to generate comprehensive documentation for your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doc-title">Document Title</Label>
                  <Input
                    id="doc-title"
                    placeholder="e.g., API Documentation, User Guide"
                    value={docForm.title}
                    onChange={(e) => setDocForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select
                    value={docForm.audience}
                    onValueChange={(value) => setDocForm(prev => ({ ...prev, audience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developers">Developers</SelectItem>
                      <SelectItem value="designers">Designers</SelectItem>
                      <SelectItem value="managers">Project Managers</SelectItem>
                      <SelectItem value="end-users">End Users</SelectItem>
                      <SelectItem value="technical">Technical Teams</SelectItem>
                      <SelectItem value="non-technical">Non-technical Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={docForm.tone}
                  onValueChange={(value) => setDocForm(prev => ({ ...prev, tone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications & Requirements</Label>
                <Textarea
                  id="specifications"
                  placeholder="Describe your project, features, APIs, architecture, technologies used, and any specific documentation requirements..."
                  rows={6}
                  value={docForm.specifications}
                  onChange={(e) => setDocForm(prev => ({ ...prev, specifications: e.target.value }))}
                />
              </div>

              <Button
                onClick={handleGenerateDocument}
                disabled={isGenerating || generateDocMutation.isPending}
                className="w-full"
              >
                {isGenerating || generateDocMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Documentation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {docsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i} className="h-96">
                  <div className="h-full bg-gray-100 animate-pulse rounded-lg" />
                </Card>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
              <p className="text-gray-600 mb-4">Generate your first AI-powered documentation</p>
              <Button onClick={() => setActiveTab('generate')}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Documentation
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {documents.map((doc: Document) => (
                <Card key={doc._id} className="h-96">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{doc.title}</CardTitle>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement download functionality
                            toast({
                              title: 'Download feature coming soon',
                              description: 'You will be able to export documents soon.',
                            });
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDocument(doc._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Generated on {new Date(doc.generatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-full overflow-hidden">
                    <Tabs defaultValue="overview" className="h-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="architecture">Architecture</TabsTrigger>
                        <TabsTrigger value="api">API</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="h-64 overflow-y-auto mt-4">
                        <div className="prose prose-sm max-w-none">
                          {renderMarkdown(doc.content.overview)}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="architecture" className="h-64 overflow-y-auto mt-4">
                        <div className="prose prose-sm max-w-none">
                          {renderMarkdown(doc.content.architecture)}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="api" className="h-64 overflow-y-auto mt-4">
                        <div className="prose prose-sm max-w-none">
                          {renderMarkdown(doc.content.apiDocs)}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}