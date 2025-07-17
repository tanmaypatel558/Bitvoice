"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import NotificationCircle from '@/components/ui/notification-circle'

interface NotificationContextType {
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  addNotification: (notification: NotificationData) => void
}

interface NotificationData {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'default'
  message: string
  title?: string
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
  showIcon?: boolean
  closable?: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([])

  const addNotification = (notification: Omit<NotificationData, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: NotificationData = {
      id,
      duration: 4000,
      position: 'top-right',
      showIcon: true,
      closable: true,
      ...notification,
    }
    
    setNotifications(prev => [...prev, newNotification])
    
    // Auto remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const success = (message: string, title?: string) => {
    addNotification({ 
      type: 'success', 
      message, 
      title,
      duration: 3000
    })
  }

  const error = (message: string, title?: string) => {
    addNotification({ 
      type: 'error', 
      message, 
      title,
      duration: 5000
    })
  }

  const warning = (message: string, title?: string) => {
    addNotification({ 
      type: 'warning', 
      message, 
      title,
      duration: 4000
    })
  }

  const info = (message: string, title?: string) => {
    addNotification({ 
      type: 'info', 
      message, 
      title,
      duration: 4000
    })
  }

  return (
    <NotificationContext.Provider value={{ success, error, warning, info, addNotification }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {notifications.map((notification) => (
          <NotificationCircle
            key={notification.id}
            type={notification.type}
            message={notification.message}
            title={notification.title}
            duration={notification.duration}
            position={notification.position}
            showIcon={notification.showIcon}
            closable={notification.closable}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
} 