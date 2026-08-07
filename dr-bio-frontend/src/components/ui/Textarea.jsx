import React from 'react';

const Textarea = ({
  className = '',
  rounded = '2xl',
  rows = 4,
  ...props
}) => {
  const roundedClass = rounded === '3xl' ? 'rounded-3xl' : 'rounded-2xl';
  const baseStyles = `w-full px-5 py-4 bg-theme-bg ${roundedClass} font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-800/20 border border-stone-200 dark:border-stone-800 transition-all placeholder:text-stone-400 resize-none`;

  return (
    <textarea
      rows={rows}
      className={`${baseStyles} ${className}`.trim()}
      {...props}
    />
  );
};

export default Textarea;
