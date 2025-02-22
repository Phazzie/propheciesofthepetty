import React from 'react';

interface Props {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  animated?: boolean;
  repeat?: number;
}

export const SkeletonLoader: React.FC<Props> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animated = true,
  repeat = 1
}) => {
  const getBaseClasses = () => {
    const baseClasses = [
      'bg-gray-200 dark:bg-gray-700',
      animated ? 'animate-pulse' : '',
      className
    ];

    switch (variant) {
      case 'circular':
        baseClasses.push('rounded-full');
        break;
      case 'rectangular':
        baseClasses.push('rounded-md');
        break;
      case 'text':
      default:
        baseClasses.push('rounded w-full h-4');
        break;
    }

    return baseClasses.filter(Boolean).join(' ');
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  const elements = Array(repeat).fill(0).map((_, index) => (
    <div
      key={index}
      className={getBaseClasses()}
      style={style}
      role="status"
      aria-label="Loading..."
    />
  ));

  return repeat === 1 ? elements[0] : (
    <div className="space-y-3">
      {elements}
    </div>
  );
};