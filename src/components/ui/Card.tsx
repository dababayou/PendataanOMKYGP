import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'indigo' | 'green' | 'red' | 'yellow' | 'gray'
}

const badgeVariants = {
  indigo: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  green: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  red: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  yellow: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  gray: 'bg-gray-50 text-gray-700 ring-1 ring-gray-200',
}

export function Badge({ children, variant = 'indigo' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${badgeVariants[variant]}
      `}
    >
      {children}
    </span>
  )
}
