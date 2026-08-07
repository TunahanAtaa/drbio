import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'p-6',
  rounded = 'rounded-2xl',
  ...props
}) => {
  const baseStyles = `bg-theme-card ${rounded} ${padding} shadow-clay-card dark:shadow-clay-card-dark border-theme-border`;

  return (
    <div
      className={`${baseStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
