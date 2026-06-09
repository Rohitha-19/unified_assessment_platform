import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  isLoading = false,
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/50',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    ghost: 'text-gray-300 hover:bg-gray-700/50',
    outline: 'border border-gray-500 text-gray-300 hover:bg-gray-700/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-xl p-6 transition-all duration-300 ${
        hover ? 'hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <input
        className={`bg-gray-800 border ${
          error ? 'border-red-500' : 'border-gray-700'
        } rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export const Select = ({ label, options, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <select
        className={`bg-gray-800 border ${
          error ? 'border-red-500' : 'border-gray-700'
        } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export const Badge = ({ children, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
    secondary: 'bg-gray-700 text-gray-300',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`} {...props}>
      {children}
    </span>
  );
};

export const Modal = ({ isOpen, onClose, title, children, ...props }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-xl transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`bg-gray-800 rounded-lg shimmer ${className}`}
          />
        ))}
    </>
  );
};

export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex gap-4 border-b border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activeTab === tab.id
              ? 'text-blue-400 border-blue-500'
              : 'text-gray-400 border-transparent hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export const Sidebar = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 z-40 lg:relative lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {children}
      </div>
    </>
  );
};

export const Toast = ({ message, type = 'info', isVisible }) => {
  if (!isVisible) return null;

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className={`fixed bottom-4 right-4 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in`}>
      {message}
    </div>
  );
};
