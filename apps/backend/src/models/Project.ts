import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      return ret;
    }
  }
});

// Index for faster queries
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ name: 1, userId: 1 }, { unique: true });

export const Project = mongoose.model<IProject>('Project', projectSchema);