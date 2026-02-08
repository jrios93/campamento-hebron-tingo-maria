import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationProps {
  id?: string
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
  duration?: number
  onClose?: () => void
}

export function Notification({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <AlertCircle className="w-6 h-6 text-red-500" />,
    info: <AlertCircle className="w-6 h-6 text-blue-500" />
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  }

  if (!isVisible) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-right fade-in-0 duration-300">
      <div className={cn(
        "relative rounded-lg border p-4 shadow-lg",
        bgColors[type]
      )}>
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-3">
          {icons[type]}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {message && (
              <p className="text-sm text-gray-600 mt-1">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Hook para manejar notificaciones
export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const showNotification = (props: Omit<NotificationProps, 'onClose'>) => {
    const id = Date.now().toString()
    
    const newNotification = {
      ...props,
      id,
      onClose: () => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }
    }

    setNotifications(prev => [...prev, newNotification as any])
  }

  return { showNotification, notifications }
}