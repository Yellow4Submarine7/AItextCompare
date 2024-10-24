// RunningCatIcon.tsx
import React from 'react';
import { FaCat } from 'react-icons/fa';

interface RunningCatIconProps {
  isRunning: boolean;
  isEnglish: boolean; // 新增 isEnglish 属性
}

const RunningCatIcon: React.FC<RunningCatIconProps> = ({ isRunning, isEnglish }) => {
  return (
    <div className="flex items-center space-x-2">
      <FaCat 
        size={24} 
        color={isRunning ? "orange" : "gray"} 
        className={isRunning ? "animate-spin-slow" : ""}
      />
      <span>{isRunning 
        ? (isEnglish ? "Processing..." : "等待中...") 
        : (isEnglish ? "Idle" : "空闲")}
      </span>
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
