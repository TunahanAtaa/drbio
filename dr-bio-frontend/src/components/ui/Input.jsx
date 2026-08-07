import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  className = '',
  rounded = '2xl',
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const roundedClass = rounded === '3xl' ? 'rounded-3xl' : 'rounded-2xl';
  const baseStyles = `w-full px-5 py-4 bg-theme-bg ${roundedClass} font-bold text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-red-600/20 border border-stone-200 dark:border-stone-800 transition-all placeholder:text-stone-400`;

  if (type === 'password') {
    return (
      <div className="relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`${baseStyles} pr-12 ${className}`.trim()}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-1 flex items-center justify-center focus:outline-none"
          tabIndex={-1}
          title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <input
      type={type}
      className={`${baseStyles} ${className}`.trim()}
      {...props}
    />
  );
};

export default Input;
