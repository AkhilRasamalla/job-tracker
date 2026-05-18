import { Schema, model, Document, Types } from 'mongoose';

// All valid status values for a job application
export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

// Interface for the Application document
export interface IApplication extends Document {
  user: Types.ObjectId;
  company: string;
  role: string;
  status: ApplicationStatus;
  dateApplied: Date;
  jobUrl?: string;
  salary?: string;
  location?: string;
  resume?: {
    fileName: string;
    fileType: string;
    fileSize: number;
    data: string;
    uploadedAt: Date;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Application schema with all job fields
const ApplicationSchema = new Schema<IApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
      maxlength: [200, 'Role cannot exceed 200 characters'],
    },
    status: {
      type: String,
      enum: ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
      default: 'Applied',
      required: [true, 'Status is required'],
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    jobUrl: {
      type: String,
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    resume: {
      fileName: {
        type: String,
        trim: true,
      },
      fileType: {
        type: String,
        trim: true,
      },
      fileSize: {
        type: Number,
      },
      data: {
        type: String,
      },
      uploadedAt: {
        type: Date,
      },
      _id: false,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Export the compiled Application model
export const Application = model<IApplication>('Application', ApplicationSchema);
