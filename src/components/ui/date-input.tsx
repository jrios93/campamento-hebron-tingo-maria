import { useState, useEffect } from 'react'

interface DateInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: string
  required?: boolean
  id?: string
}

export function DateInput({ 
  value = '', 
  onChange, 
  placeholder = 'DD/MM/AAAA', 
  className = '', 
  error,
  required = false 
}: DateInputProps) {
  const [displayValue, setDisplayValue] = useState(value)

  // Formatear la fecha para que solo sea DD/MM/YYYY
  const formatDateInput = (input: string) => {
    // Remover todo excepto números y barras
    let cleaned = input.replace(/[^\d/]/g, '')
    
    // Limitar a 10 caracteres (DD/MM/YYYY)
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10)
    }
    
    // Agregar barras automáticamente
    if (cleaned.length >= 2 && cleaned.length <= 2) {
      cleaned = cleaned + '/'
    } else if (cleaned.length >= 5 && cleaned.length <= 5) {
      cleaned = cleaned + '/'
    }
    
    // Limitar valores
    const parts = cleaned.split('/')
    
    // Día: máximo 31
    if (parts[0] && parseInt(parts[0]) > 31) {
      parts[0] = '31'
    }
    
    // Mes: máximo 12
    if (parts[1] && parseInt(parts[1]) > 12) {
      parts[1] = '12'
    }
    
    // Año: formato 4 dígitos
    if (parts[2] && parts[2].length > 4) {
      parts[2] = parts[2].substring(0, 4)
    }
    
    return parts.join('/')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value)
    setDisplayValue(formatted)
    
    // Convertir a formato YYYY-MM-DD para el backend
    if (isValidDate(formatted)) {
      const [dd, mm, yyyy] = formatted.split('/')
      if (dd && mm && yyyy) {
        const isoDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
        onChange(isoDate)
      }
    } else {
      onChange('')
    }
  }

  // Validar si la fecha es válida
  const isValidDate = (dateString: string) => {
    const [dd, mm, yyyy] = dateString.split('/')
    if (!dd || !mm || !yyyy) return false
    
    const day = parseInt(dd)
    const month = parseInt(mm)
    const year = parseInt(yyyy)
    
    if (day < 1 || day > 31) return false
    if (month < 1 || month > 12) return false
    if (year < 1900 || year > 2100) return false
    
    return true
  }

  // Convertir YYYY-MM-DD a DD/MM/YYYY para mostrar
  useEffect(() => {
    if (value && value.includes('-')) {
      const [yyyy, mm, dd] = value.split('-')
      setDisplayValue(`${dd}/${mm}/${yyyy}`)
    }
  }, [value])

  return (
    <div>
      <input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-md 
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          ${error ? 'border-destructive' : 'border-input'}
          ${className}
        `}
      />
      {error && (
        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
      {!error && (
        <p className="text-xs text-muted-foreground mt-1">
          * Formato: Día/Mes/Año (ej: 15/01/2010)
        </p>
      )}
    </div>
  )
}