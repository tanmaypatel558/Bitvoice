"use client"

import React, { useState, useEffect } from 'react'
import { X, Check, AlertCircle, Info, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationCircleProps {
  type?: 'success' | 'error' | 'warning' | 'info' | 'default'
  message: string
  title?: string
  duration?: number
  onClose?: () => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
  showIcon?: boolean
  closable?: boolean
}

const NotificationCircle: React.FC<NotificationCircleProps> = ({
  type = 'default',
  message,
  title,
  duration = 4000,
  onClose,
  position = 'top-right',
  showIcon = true,
  closable = true
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5" />
      case 'error':
        return <X className="h-5 w-5" />
      case 'warning':
        return <AlertCircle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-300 shadow-green-200'
      case 'error':
        return 'bg-gradient-to-br from-red-400 to-rose-500 text-white border-red-300 shadow-red-200'
      case 'warning':
        return 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-yellow-300 shadow-yellow-200'
      case 'info':
        return 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white border-blue-300 shadow-blue-200'
      default:
        return 'bg-gradient-to-br from-gray-600 to-gray-700 text-white border-gray-400 shadow-gray-200'
    }
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2'
      default:
        return 'top-4 right-4'
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed z-[9999] max-w-sm w-full mx-auto',
        getPositionStyles(),
        isExiting ? 'animate-out fade-out-0 slide-out-to-right-full duration-300' : 'animate-in fade-in-0 slide-in-from-right-full duration-500'
      )}
    >
      <div
        className={cn(
          'relative rounded-full p-4 border-2 shadow-2xl backdrop-blur-sm',
          'hover:scale-105 transition-all duration-300 ease-out',
          'before:absolute before:inset-0 before:rounded-full before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-300',
          'hover:before:opacity-100',
          getTypeStyles()
        )}
      >
        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white"></div>
        
        {/* Main Content */}
        <div className="relative flex items-center space-x-3">
          {/* Icon Circle */}
          {showIcon && (
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              {getIcon()}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold text-sm mb-1 truncate">
                {title}
              </h4>
            )}
            <p className="text-sm opacity-90 leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          {closable && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        
        {/* Progress Bar */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/60 rounded-full animate-pulse"
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Notification Manager Hook
export const useNotificationCircle = () => {
  const [notifications, setNotifications] = useState<Array<NotificationCircleProps & { id: string }>>([])

  const addNotification = (notification: Omit<NotificationCircleProps, 'onClose'>) => {
    const id = Date.now().toString()
    const newNotification = {
      ...notification,
      id,
      onClose: () => removeNotification(id)
    }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 4000)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const success = (message: string, title?: string) => {
    addNotification({ type: 'success', message, title })
  }

  const error = (message: string, title?: string) => {
    addNotification({ type: 'error', message, title })
  }

  const warning = (message: string, title?: string) => {
    addNotification({ type: 'warning', message, title })
  }

  const info = (message: string, title?: string) => {
    addNotification({ type: 'info', message, title })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }
}

// Notification Container Component
export const NotificationContainer: React.FC = () => {
  const { notifications } = useNotificationCircle()

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {notifications.map((notification) => (
        <NotificationCircle
          key={notification.id}
          {...notification}
        />
      ))}
    </div>
  )
}

export default NotificationCircle 