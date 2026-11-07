import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-slate-500 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'w-full bg-[#111118] border border-[#1e1e2e] focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-10',
              error && 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
