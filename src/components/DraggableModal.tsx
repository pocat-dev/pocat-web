import { useState, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface DraggableModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function DraggableModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = ''
}: DraggableModalProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const getAdaptiveStyles = () => {
    const computedStyle = getComputedStyle(document.documentElement)
    return {
      background: computedStyle.getPropertyValue('--surface-primary') || '#ffffff',
      border: `1px solid ${computedStyle.getPropertyValue('--border-primary') || '#e5e7eb'}`,
      color: computedStyle.getPropertyValue('--text-primary') || '#111827',
      headerBorder: computedStyle.getPropertyValue('--border-secondary') || '#f3f4f6',
      closeHover: computedStyle.getPropertyValue('--surface-tertiary') || '#f9fafb',
      shadow: computedStyle.getPropertyValue('--shadow-lg') || '0 10px 25px rgba(0,0,0,0.15)'
    }
  }

  const adaptiveStyles = getAdaptiveStyles()

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
      })
    }

    const handleMouseUp = () => setIsDragging(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    setIsDragging(true)
  }

  if (!isOpen) return null

  return createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <div
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          background: adaptiveStyles.background,
          border: adaptiveStyles.border,
          borderRadius: '12px',
          boxShadow: adaptiveStyles.shadow,
          minWidth: '320px',
          maxWidth: '480px',
          pointerEvents: 'auto',
          fontFamily: 'system-ui, sans-serif',
          color: adaptiveStyles.color,
          animation: 'modalSlideIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          backdropFilter: 'blur(8px)',
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          transition: isDragging ? 'none' : 'transform 0.2s'
        }}
      >
        <div
          onMouseDown={handleMouseDown}
          style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${adaptiveStyles.headerBorder}`,
            cursor: isDragging ? 'grabbing' : 'grab',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            userSelect: 'none',
            borderRadius: '12px 12px 0 0'
          }}
        >
          {title && <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{title}</h3>}
          <button 
            onClick={onClose}
            onMouseEnter={(e) => e.currentTarget.style.background = adaptiveStyles.closeHover}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all 0.2s',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ padding: '20px', fontSize: '14px', lineHeight: '1.6' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.9) translateY(-20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  )
}
