import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, count, icon: Icon, colorClass, bgClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
      <div className={`p-4 rounded-full ${bgClass}`}>
        <Icon className={`w-8 h-8 ${colorClass}`} />
      </div>
    </div>
  );
};

export default StatusCard;
