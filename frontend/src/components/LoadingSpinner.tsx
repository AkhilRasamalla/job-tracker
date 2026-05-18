import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', fullScreen = false }) => {
  const spinner = (
    <div className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses[size]}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
