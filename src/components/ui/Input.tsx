import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

const COLORS = {
  red: '#d12027',
  redLight: '#fbe9e9',
  green: '#00a54d',
}

export function Input({ label, error, hint, className = '', id, style, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
        {label}
        {props.required && <span className="ml-0.5" style={{ color: COLORS.red }}>*</span>}
      </label>
      <input
        id={inputId}
        style={{
          borderColor: error ? COLORS.red : undefined,
          backgroundColor: error ? COLORS.redLight : undefined,
          ...style
        }}
        className={`
          w-full px-4 py-3 rounded-xl border text-sm
          transition-all duration-200 outline-none
          placeholder:text-gray-400
          ${error
            ? 'focus:ring-2 focus:ring-red-500/10'
            : 'border-gray-300 focus:border-brand-green focus:ring-4 focus:ring-green-500/10 bg-white'
          }
          disabled:bg-gray-50 disabled:cursor-not-allowed
          shadow-sm
          ${className}
        `}
        {...props}
      />
      {hint && !error && <p className="text-xs text-gray-500 ml-1">{hint}</p>}
      {error && <p className="text-xs font-medium ml-1" style={{ color: COLORS.red }}>{error}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ label, error, options, placeholder, className = '', id, style, ...props }: SelectProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
        {label}
        {props.required && <span className="ml-0.5" style={{ color: COLORS.red }}>*</span>}
      </label>
      <select
        id={inputId}
        style={{
          borderColor: error ? COLORS.red : undefined,
          ...style
        }}
        className={`
          w-full px-4 py-3 rounded-xl border text-sm
          transition-all duration-200 outline-none bg-white
          ${error
            ? 'focus:ring-2 focus:ring-red-500/10'
            : 'border-gray-300 focus:border-brand-green focus:ring-4 focus:ring-green-500/10'
          }
          disabled:bg-gray-50 disabled:cursor-not-allowed
          shadow-sm
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs font-medium ml-1" style={{ color: COLORS.red }}>{error}</p>}
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function TextArea({ label, error, className = '', id, style, ...props }: TextAreaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
        {label}
        {props.required && <span className="ml-0.5" style={{ color: COLORS.red }}>*</span>}
      </label>
      <textarea
        id={inputId}
        rows={3}
        style={{
          borderColor: error ? COLORS.red : undefined,
          backgroundColor: error ? COLORS.redLight : undefined,
          ...style
        }}
        className={`
          w-full px-4 py-3 rounded-xl border text-sm resize-none
          transition-all duration-200 outline-none
          placeholder:text-gray-400
          ${error
            ? 'focus:ring-2 focus:ring-red-500/10'
            : 'border-gray-300 focus:border-brand-green focus:ring-4 focus:ring-green-500/10 bg-white'
          }
          shadow-sm
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs font-medium ml-1" style={{ color: COLORS.red }}>{error}</p>}
    </div>
  )
}
