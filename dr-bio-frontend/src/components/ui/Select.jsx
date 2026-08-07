import React from 'react';

const Select = ({
  children,
  className = '',
  rounded = '2xl',
  ...props
}) => {
  const roundedClass = rounded === '3xl' ? 'rounded-3xl' : 'rounded-2xl';
  const baseStyles = `w-full px-5 py-4 bg-theme-bg ${roundedClass} font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-800/20 border border-stone-200 dark:border-stone-800 transition-all cursor-pointer`;

  return (
    <select
      className={`${baseStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;
