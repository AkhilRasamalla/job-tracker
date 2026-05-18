import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from './config/db';
import { Application, User } from './models';

dotenv.config();

const demoUser = {
  name: 'Demo User',
  email: 'demo@jobtracker.com',
  password: 'demo123',
};

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const seed = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash(demoUser.password, 10);
  const user = await User.findOneAndUpdate(
    { email: demoUser.email },
    {
      name: demoUser.name,
      email: demoUser.email,
      password: hashedPassword,
    },
    { new: true, upsert: true, runValidators: true }
  );

  await Application.deleteMany({ user: user._id });

  await Application.insertMany([
    {
      user: user._id,
      company: 'Google',
      role: 'Frontend Engineer',
      status: 'Applied',
      dateApplied: daysAgo(3),
      jobUrl: 'https://careers.google.com',
      salary: '$145k - $185k',
      location: 'Mountain View, CA',
      notes: 'Applied to a role focused on design systems and search experiences.',
    },
    {
      user: user._id,
      company: 'Vercel',
      role: 'Full Stack Developer',
      status: 'Applied',
      dateApplied: daysAgo(5),
      jobUrl: 'https://vercel.com/careers',
      salary: '$130k - $170k',
      location: 'Remote',
      notes: 'Strong match for React, TypeScript, and deployment platform experience.',
    },
    {
      user: user._id,
      company: 'Notion',
      role: 'Product Engineer',
      status: 'Applied',
      dateApplied: daysAgo(7),
      jobUrl: 'https://www.notion.so/careers',
      salary: '$135k - $175k',
      location: 'San Francisco, CA',
      notes: 'Submitted resume tailored around collaboration tools and editor UX.',
    },
    {
      user: user._id,
      company: 'Stripe',
      role: 'Backend Engineer',
      status: 'Screening',
      dateApplied: daysAgo(10),
      jobUrl: 'https://stripe.com/jobs',
      salary: '$155k - $205k',
      location: 'New York, NY',
      notes: 'Recruiter screen scheduled after initial application review.',
    },
    {
      user: user._id,
      company: 'Figma',
      role: 'Frontend Platform Engineer',
      status: 'Screening',
      dateApplied: daysAgo(12),
      jobUrl: 'https://www.figma.com/careers',
      salary: '$150k - $195k',
      location: 'San Francisco, CA',
      notes: 'Screening for component infrastructure and performance work.',
    },
    {
      user: user._id,
      company: 'Linear',
      role: 'Full Stack Engineer',
      status: 'Interview',
      dateApplied: daysAgo(16),
      jobUrl: 'https://linear.app/careers',
      salary: '$140k - $185k',
      location: 'Remote',
      notes: 'Technical interview focused on product thinking and API design.',
    },
    {
      user: user._id,
      company: 'Airbnb',
      role: 'Software Engineer, Web',
      status: 'Interview',
      dateApplied: daysAgo(19),
      jobUrl: 'https://careers.airbnb.com',
      salary: '$150k - $210k',
      location: 'San Francisco, CA',
      notes: 'Frontend coding round completed; waiting for system design round.',
    },
    {
      user: user._id,
      company: 'Shopify',
      role: 'React Engineer',
      status: 'Interview',
      dateApplied: daysAgo(22),
      jobUrl: 'https://www.shopify.com/careers',
      salary: '$120k - $165k',
      location: 'Remote',
      notes: 'Interviewing for merchant dashboard and admin tooling team.',
    },
    {
      user: user._id,
      company: 'Atlassian',
      role: 'Full Stack Software Engineer',
      status: 'Offer',
      dateApplied: daysAgo(35),
      jobUrl: 'https://www.atlassian.com/company/careers',
      salary: '$135k - $175k',
      location: 'Remote',
      notes: 'Offer received after final values and technical interviews.',
    },
    {
      user: user._id,
      company: 'Meta',
      role: 'Software Engineer, Product',
      status: 'Rejected',
      dateApplied: daysAgo(28),
      jobUrl: 'https://www.metacareers.com',
      salary: '$160k - $220k',
      location: 'Menlo Park, CA',
      notes: 'Rejected after phone screen; resume saved for future product roles.',
    },
    {
      user: user._id,
      company: 'Netflix',
      role: 'UI Engineer',
      status: 'Rejected',
      dateApplied: daysAgo(31),
      jobUrl: 'https://jobs.netflix.com',
      salary: '$170k - $230k',
      location: 'Los Gatos, CA',
      notes: 'Role required deeper streaming media experience.',
    },
    {
      user: user._id,
      company: 'Canva',
      role: 'Frontend Engineer',
      status: 'Rejected',
      dateApplied: daysAgo(38),
      jobUrl: 'https://www.canva.com/careers',
      salary: '$115k - $155k',
      location: 'Austin, TX',
      notes: 'Strong design systems role, but hiring team moved forward with another candidate.',
    },
    {
      user: user._id,
      company: 'OpenAI',
      role: 'Developer Experience Engineer',
      status: 'Wishlist',
      dateApplied: daysAgo(1),
      jobUrl: 'https://openai.com/careers',
      salary: '$160k - $220k',
      location: 'San Francisco, CA',
      notes: 'Wishlist role to apply after tailoring resume around API and docs projects.',
    },
    {
      user: user._id,
      company: 'GitHub',
      role: 'Platform Engineer',
      status: 'Withdrawn',
      dateApplied: daysAgo(42),
      jobUrl: 'https://github.careers',
      salary: '$135k - $180k',
      location: 'Remote',
      notes: 'Withdrawn after accepting another interview timeline.',
    },
    {
      user: user._id,
      company: 'Dropbox',
      role: 'Software Engineer, Collaboration',
      status: 'Withdrawn',
      dateApplied: daysAgo(45),
      jobUrl: 'https://jobs.dropbox.com',
      salary: '$130k - $175k',
      location: 'Remote',
      notes: 'Withdrawn because the role shifted toward mobile engineering.',
    },
  ]);

  console.log('[seed] Demo user created: demo@jobtracker.com / demo123');
  console.log('[seed] Added 15 demo job applications');
};

seed()
  .catch((error) => {
    console.error('[seed] Failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
