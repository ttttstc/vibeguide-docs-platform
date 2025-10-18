import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
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

const documentSchema = new Schema<IDocument>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    overview: { type: String, required: true },
    architecture: { type: String, required: true },
    apiDocs: { type: String, required: true }
  },
  projectId: {
    type: String,
    required: true,
    ref: 'Project'
  }
}, {
  timestamps: { createdAt: 'generatedAt', updatedAt: false },
  toJSON: {
    transform: function(doc, ret) {
      return ret;
    }
  }
});

// Index for faster queries
documentSchema.index({ projectId: 1, generatedAt: -1 });
documentSchema.index({ title: 1, projectId: 1 });

export const Document = mongoose.model<IDocument>('Document', documentSchema);