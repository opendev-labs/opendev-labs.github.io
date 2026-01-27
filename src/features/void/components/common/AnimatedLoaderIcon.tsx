import React from 'react';

interface AnimatedLoaderIconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const AnimatedLoaderIcon: React.FC<AnimatedLoaderIconProps> = ({ size = 24, strokeWidth = 2, className }) => {
  // Keyframes are defined here and will be injected into the document's head.
  // Using a unique name prevents conflicts if this pattern is used elsewhere.
  const animationStyles = `
    @keyframes draw_kf_void {
        50% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -80; }
    }
    @keyframes pulse_in_kf_void {
        0% { opacity: 0; transform: scale(0.5); }
        20%, 100% { opacity: 1; transform: scale(1); }
        40% { transform: scale(1.1); }
    }
  `;
  
  return (
    <div className={`relative ${className || ''}`} style={{ width: size, height: size }}>
      <style>{animationStyles}</style>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
            d="M12 2L2 12L12 22L22 12L12 2Z" 
            stroke="currentColor" 
            strokeWidth={strokeWidth} 
            strokeLinejoin="round"
            style={{
                strokeDasharray: 80,
                strokeDashoffset: 80,
                animation: 'draw_kf_void 2s ease-in-out forwards infinite'
            }}
        />
        <path 
            d="M12 7L7 12L12 17L17 12L12 7Z" 
            fill="currentColor"
            style={{
                opacity: 0,
                transformOrigin: 'center',
                animation: 'pulse_in_kf_void 2s ease-in-out forwards infinite'
            }}
        />
      </svg>
    </div>
  );
};
