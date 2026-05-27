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

export type ApplicationPriority = 'Low' | 'Medium' | 'High';

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
  priority?: ApplicationPriority;
  source?: string;
  contactName?: string;
  contactEmail?: string;
  followUpDate?: Date;
  jobDescription?: string;
  statusHistory?: {
    status: ApplicationStatus;
    changedAt: Date;
  }[];
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
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    source: {
      type: String,
      trim: true,
      maxlength: [120, 'Source cannot exceed 120 characters'],
    },
    contactName: {
      type: String,
      trim: true,
      maxlength: [120, 'Contact name cannot exceed 120 characters'],
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [160, 'Contact email cannot exceed 160 characters'],
    },
    followUpDate: {
      type: Date,
    },
    jobDescription: {
      type: String,
      trim: true,
      maxlength: [30000, 'Job description cannot exceed 30000 characters'],
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        _id: false,
      },
    ],
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
      maxlength: [20000, 'Notes cannot exceed 20000 characters'],
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

// Export the compiled Application model
export const Application = model<IApplication>('Application', ApplicationSchema);
