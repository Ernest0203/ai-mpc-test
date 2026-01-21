import React, { useEffect } from 'react'

interface NotificationProps {
  message: string
  onClose: () => void
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
      zIndex: 1000
    }}>
      {message}
    </div>
  )
}

export default Notification
