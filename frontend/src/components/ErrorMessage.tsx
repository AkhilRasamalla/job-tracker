import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title = 'Error', message }) => {
  return (
    <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 flex items-start">
      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-red-600" />
      <div>
        <h4 className="text-sm font-semibold text-red-800">{title}</h4>
        <p className="mt-1 text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
