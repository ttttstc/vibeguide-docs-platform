import express, { Response } from 'express';
import Joi from 'joi';
import { Project } from '../models/Project';
import { Document } from '../models/Document';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const createProjectSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(1000).required()
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  description: Joi.string().min(1).max(1000)
}).min(1);

// GET /api/projects - List user projects
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ userId: req.user?.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments({ userId: req.user?.userId });

    res.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('List projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user?.userId
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get documents for this project
    const documents = await Document.find({ projectId: project._id })
      .sort({ generatedAt: -1 });

    res.json({
      success: true,
      data: {
        project,
        documents
      }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/projects - Create new project
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Validate input
    const { error, value } = createProjectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details[0].message 
      });
    }

    // Check if project name already exists for this user
    const existingProject = await Project.findOne({
      name: value.name,
      userId: req.user?.userId
    });

    if (existingProject) {
      return res.status(400).json({ error: 'Project with this name already exists' });
    }

    // Create new project
    const project = new Project({
      ...value,
      userId: req.user?.userId
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Validate input
    const { error, value } = updateProjectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details[0].message 
      });
    }

    // Check if project name already exists (if name is being updated)
    if (value.name) {
      const existingProject = await Project.findOne({
        name: value.name,
        userId: req.user?.userId,
        _id: { $ne: req.params.id }
      });

      if (existingProject) {
        return res.status(400).json({ error: 'Project with this name already exists' });
      }
    }

    // Update project
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      value,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Check if project exists and belongs to user
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user?.userId
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete all documents associated with this project
    await Document.deleteMany({ projectId: project._id });

    // Delete the project
    await Project.findByIdAndDelete(project._id);

    res.json({
      success: true,
      message: 'Project and associated documents deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as projectRoutes };