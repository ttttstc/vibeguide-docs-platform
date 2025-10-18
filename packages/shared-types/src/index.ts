// User related types
export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Auth middleware
export interface AuthRequest {
  user?: {
    userId: string;
    email: string;
  };
}

// Project related types
export interface Project {
  _id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

// Document related types
export interface Document {
  _id: string;
  title: string;
  content: DocumentContent;
  projectId: string;
  generatedAt: Date;
}

export interface DocumentContent {
  overview: string;
  architecture: string;
  apiDocs: string;
  [key: string]: string;
}

export interface GenerateDocRequest {
  title: string;
  audience: string;
  tone: string;
  specifications: string;
  projectId: string;
}

export interface GenerateDocResponse {
  document: Document;
  success: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}