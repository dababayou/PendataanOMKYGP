import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

// Brand colors for robust inline styling
const COLORS = {
  green: '#00a54d',
  greenDark: '#007a38',
  red: '#d12027',
  redDark: '#a81920',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  style,
  ...props
}: ButtonProps) {
  
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:-translate-y-0.5 active:translate-y-0'
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  // Determine styles and classes based on variant
  let variantStyle: React.CSSProperties = {}
  let variantClasses = ''

  if (variant === 'primary') {
    variantStyle = { backgroundColor: COLORS.green, color: 'white' }
    variantClasses = 'hover:shadow-lg hover:shadow-green-500/20'
  } else if (variant === 'danger') {
    variantStyle = { backgroundColor: COLORS.red, color: 'white' }
    variantClasses = 'hover:shadow-lg hover:shadow-red-500/20'
  } else if (variant === 'secondary') {
    variantClasses = 'bg-white text-gray-900 border border-gray-200'
  } else if (variant === 'outline') {
    variantStyle = { borderColor: COLORS.green, color: COLORS.green }
    variantClasses = 'border hover:bg-green-50'
  } else if (variant === 'ghost') {
    variantClasses = 'text-gray-600 hover:bg-gray-100 shadow-none hover:translate-y-0'
  }

  return (
    <button
      disabled={disabled || loading}
      style={{ ...variantStyle, ...style }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 mr-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
        </svg>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
