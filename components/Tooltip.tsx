
import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  isClickable?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, onClick, isClickable }) => {
  const [isVisible, setIsVisible] = useState(false);

  const baseClasses = "text-[#e2a32d] border-b border-dotted border-[#e2a32d]/50 outline-none";
  const clickableClasses = "cursor-pointer hover:border-[#e2a32d]/80 transition-all duration-200 hover:brightness-110";

  return (
    <span 
        className="relative inline-block" 
        onMouseEnter={() => setIsVisible(true)} 
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
    >
      <span 
        className={`${baseClasses} ${isClickable ? clickableClasses : ''}`}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' && onClick) onClick(); }}
        tabIndex={onClick ? 0 : -1}
        role={onClick ? 'button' : undefined}
        aria-label={isClickable ? `Start chat about ${children}` : undefined}
      >
        {children}
      </span>
      {isVisible && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-[#333e48] text-gray-200 text-sm rounded-lg shadow-lg z-20 transition-opacity duration-300"
          role="tooltip"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#333e48]"></div>
        </div>
      )}
    </span>
  );
};

export default Tooltip;
