import express, { Response } from 'express';
import Joi from 'joi';
import OpenAI from 'openai';
import { Project } from '../models/Project';
import { Document, DocumentContent } from '../models/Document';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Validation schema
const generateDocSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  audience: Joi.string().min(1).max(100).required(),
  tone: Joi.string().valid('professional', 'casual', 'technical', 'friendly').required(),
  specifications: Joi.string().min(10).max(5000).required(),
  projectId: Joi.string().required()
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate structured prompt for OpenAI
const generatePrompt = (title: string, audience: string, tone: string, specifications: string): string => {
  return `You are a technical documentation expert. Generate comprehensive documentation based on the following specifications:

Title: ${title}
Target Audience: ${audience}
Tone: ${tone}
Specifications: ${specifications}

Please generate documentation structured in the following JSON format:
{
  "overview": "A comprehensive overview of the project/system including its purpose, key features, and high-level description",
  "architecture": "Detailed architecture description including system components, data flow, technology stack, and design patterns used",
  "apiDocs": "Complete API documentation with endpoints, request/response formats, authentication methods, and usage examples"
}

Requirements:
1. Write clear, professional, and comprehensive documentation
2. Include specific examples where applicable
3. Use proper markdown formatting for better readability
4. Ensure all sections are substantial and detailed
5. Focus on practical information that ${audience} would need

Please respond with valid JSON only, no additional text.`;
};

// Parse and validate OpenAI response
const parseOpenAIResponse = (content: string): DocumentContent => {
  try {
    // Try to parse as JSON directly
    const parsed = JSON.parse(content);
    
    // Validate required fields
    const requiredFields = ['overview', 'architecture', 'apiDocs'];
    for (const field of requiredFields) {
      if (!parsed[field] || typeof parsed[field] !== 'string') {
        throw new Error(`Missing or invalid field: ${field}`);
      }
    }
    
    return parsed as DocumentContent;
  } catch (error) {
    throw new Error('Failed to parse AI response as valid JSON documentation');
  }
};

// POST /api/generate-doc - Generate AI documentation
router.post('/generate-doc', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Validate input
    const { error, value } = generateDocSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details[0].message 
      });
    }

    const { title, audience, tone, specifications, projectId } = value;

    // Verify project exists and belongs to user
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user?.userId
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Generate documentation using OpenAI
    const prompt = generatePrompt(title, audience, tone, specifications);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a technical documentation expert. Always respond with valid JSON containing structured documentation.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    // Parse and validate the AI response
    const documentContent = parseOpenAIResponse(aiResponse);

    // Create and save document
    const document = new Document({
      title,
      content: documentContent,
      projectId,
      generatedAt: new Date()
    });

    await document.save();

    res.status(201).json({
      success: true,
      data: {
        document,
        usage: completion.usage
      },
      message: 'Documentation generated successfully'
    });

  } catch (error: any) {
    console.error('Generate documentation error:', error);
    
    // Handle specific OpenAI errors
    if (error.type === 'insufficient_quota') {
      return res.status(429).json({ 
        error: 'OpenAI API quota exceeded. Please try again later.' 
      });
    }
    
    if (error.type === 'invalid_request_error') {
      return res.status(400).json({ 
        error: 'Invalid request to OpenAI API.' 
      });
    }
    
    if (error.type === 'rate_limit_exceeded') {
      return res.status(429).json({ 
        error: 'OpenAI API rate limit exceeded. Please try again later.' 
      });
    }
    
    // Handle parsing errors
    if (error.message.includes('Failed to parse AI response')) {
      return res.status(500).json({ 
        error: 'Failed to generate valid documentation. Please try again.' 
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/generate-doc/:id - Get generated document by ID
router.get('/generate-doc/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Find document and verify it belongs to a project owned by the user
    const document = await Document.findById(req.params.id).populate({
      path: 'projectId',
      match: { userId: req.user?.userId },
      select: 'name description userId'
    });

    if (!document || !document.projectId) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/generate-doc/:id - Delete generated document
router.delete('/generate-doc/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Find document and verify it belongs to a project owned by the user
    const document = await Document.findById(req.params.id).populate({
      path: 'projectId',
      match: { userId: req.user?.userId },
      select: 'userId'
    });

    if (!document || !document.projectId) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as generateRoutes };