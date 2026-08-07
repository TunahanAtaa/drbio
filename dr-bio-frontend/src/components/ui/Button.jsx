import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-black rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 text-white shadow-clay-btn',
    indigo: 'bg-indigo-800 hover:bg-indigo-900 text-white shadow-clay-btn',
    secondary: 'bg-theme-bg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-clay-btn',
    ghost: 'bg-transparent text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-5 py-3 text-sm',
    xl: 'px-6 py-4 text-base',
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
