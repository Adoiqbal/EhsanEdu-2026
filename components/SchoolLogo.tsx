import React from 'react';
import { GraduationCap } from 'lucide-react';

export const SchoolLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <GraduationCap className="w-3/4 h-3/4 text-blue-600" strokeWidth={1.5} />
    </div>
  );
};