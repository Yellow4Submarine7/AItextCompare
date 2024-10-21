// RunningCatIcon.tsx
import React from 'react';
import { FaCat } from 'react-icons/fa';

interface RunningCatIconProps {
  isRunning: boolean;
}

const RunningCatIcon: React.FC<RunningCatIconProps> = ({ isRunning }) => {
  return (
    <div className="flex items-center space-x-2">
      <FaCat 
        size={24} 
        color={isRunning ? "orange" : "gray"} 
        className={isRunning ? "animate-spin-slow" : ""}
      />
      <span>{isRunning ? "等待中..." : "空闲"}</span>
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RunningCatIcon;
