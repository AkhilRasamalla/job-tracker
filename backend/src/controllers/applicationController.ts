import { Response } from 'express';
import { Application } from '../models';
import { AuthRequest } from '../middleware/auth';

// Get all job applications belonging to the authenticated user
export const getApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`[applications] Fetching all applications for userId: ${req.userId}`);
  try {
    const applications = await Application.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) {
    console.error('[applications] Get all error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
};

// Get a single application by ID (must belong to the authenticated user)
export const getApplicationById = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`[applications] Fetching application id: ${req.params.id}`);
  try {
    const application = await Application.findOne({ _id: req.params.id, user: req.userId });
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }
    res.json({ application });
  } catch (error) {
    console.error('[applications] Get by ID error:', error);
    res.status(500).json({ message: 'Server error fetching application' });
  }
};

// Create a new job application for the authenticated user
export const createApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`[applications] Creating application for userId: ${req.userId}`);
  try {
    const { company, role, status, dateApplied, jobUrl, salary, location, resume, notes } = req.body;

    if (!company || !role) {
      res.status(400).json({ message: 'Company and role are required' });
      return;
    }

    const application = await Application.create({
      user: req.userId,
      company,
      role,
      status: status || 'Applied',
      dateApplied: dateApplied || new Date(),
      jobUrl,
      salary,
      location,
      resume: resume || undefined,
      notes,
    });

    console.log(`[applications] Created: ${application._id}`);
    res.status(201).json({ application });
  } catch (error) {
    console.error('[applications] Create error:', error);
    res.status(500).json({ message: 'Server error creating application' });
  }
};

// Update an existing application (must belong to the authenticated user)
export const updateApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`[applications] Updating application id: ${req.params.id}`);
  try {
    const { company, role, status, dateApplied, jobUrl, salary, location, resume, notes } = req.body;

    const update: Record<string, unknown> = {
      company,
      role,
      status,
      dateApplied,
      jobUrl,
      salary,
      location,
      notes,
    };

    if (resume === null) {
      update.$unset = { resume: '' };
    } else if (resume) {
      update.resume = resume;
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      update,
      { new: true, runValidators: true }
    );

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    console.log(`[applications] Updated: ${application._id}`);
    res.json({ application });
  } catch (error) {
    console.error('[applications] Update error:', error);
    res.status(500).json({ message: 'Server error updating application' });
  }
};

// Delete an application by ID (must belong to the authenticated user)
export const deleteApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log(`[applications] Deleting application id: ${req.params.id}`);
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    console.log(`[applications] Deleted: ${req.params.id}`);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('[applications] Delete error:', error);
    res.status(500).json({ message: 'Server error deleting application' });
  }
};
