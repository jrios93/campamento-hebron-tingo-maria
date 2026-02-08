import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileSpreadsheet, Users, Users2 } from 'lucide-react'

interface YouthRegistration {
  id: string
  full_name: string
  dni: string
  birth_date: string
  phone: string
  email: string
  travel_mode: string
  created_at: string
  calculated_age?: number
}

interface CoupleRegistration {
  id: string
  first_name: string
  last_name: string
  dni: string
  birth_date: string
  has_partner: boolean
  partner_first_name: string
  partner_last_name: string
  partner_dni: string
  partner_birth_date: string
  children_count: number
  phone: string
  email: string
  travel_mode: string
  created_at: string
  main_person_age?: number
  partner_age?: number
}

interface ExcelDownloadButtonProps {
  youths?: YouthRegistration[]
  couples?: CoupleRegistration[]
  onDownloadStart?: () => void
  onDownloadComplete?: () => void
}

export function ExcelDownloadButton({ 
  youths = [], 
  couples = [],
  onDownloadStart,
  onDownloadComplete 
}: ExcelDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  // Convertir fecha a formato DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  // Calcular edad
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    const dayDiff = today.getDate() - birth.getDate()
    return monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age
  }

  // Convertir datos a formato CSV
  const convertToCSV = () => {
    const headers = [
      'Tipo de Registro',
      'Nombre Completo',
      'DNI',
      'Fecha de Nacimiento',
      'Edad',
      'Teléfono',
      'Correo Electrónico',
      'Modalidad de Viaje',
      'Nombre de la Pareja',
      'DNI de la Pareja', 
      'Fecha de Nacimiento Pareja',
      'Edad de la Pareja',
      'Cantidad de Hijos',
      'Fecha de Registro',
      'Total Personas'
    ]

    // Datos de jóvenes
    const youthData = youths.map(youth => [
      'Joven',
      youth.full_name || '',
      youth.dni || 'Sin DNI',
      formatDate(youth.birth_date),
      calculateAge(youth.birth_date),
      youth.phone || '',
      youth.email || 'Sin correo',
      youth.travel_mode === 'movilidad' ? 'Movilidad propia' : 'Bus',
      '', // Nombre pareja
      '', // DNI pareja
      '', // Fecha nacimiento pareja
      '', // Edad pareja
      '', // Cantidad hijos
      formatDate(youth.created_at),
      1 // Total personas
    ])

    // Datos de parejas
    const coupleData = couples.map(couple => [
      couple.has_partner ? 'Pareja' : 'Persona sola',
      `${couple.first_name} ${couple.last_name}`,
      couple.dni || 'Sin DNI',
      formatDate(couple.birth_date),
      calculateAge(couple.birth_date),
      couple.phone || '',
      couple.email || 'Sin correo',
      couple.travel_mode === 'movilidad' ? 'Movilidad propia' : 'Bus',
      couple.has_partner ? `${couple.partner_first_name} ${couple.partner_last_name}` : 'Sin pareja',
      couple.has_partner ? (couple.partner_dni || 'Sin DNI') : '',
      couple.has_partner ? formatDate(couple.partner_birth_date || '') : '',
      couple.has_partner ? calculateAge(couple.partner_birth_date || '') : 0,
      couple.children_count || 0,
      formatDate(couple.created_at),
      couple.has_partner ? 2 + (couple.children_count || 0) : 1 + (couple.children_count || 0)
    ])

    // Combinar todos los datos
    const allData = [...youthData, ...coupleData]

    // Convertir a CSV
    const csvContent = [
      headers.join(','),
      ...allData.map(row => 
        row.map(cell => {
          // Escapar comas y quotes
          const cellStr = String(cell || '').replace(/"/g, '""')
          return cellStr.includes(',') ? `"${cellStr}"` : cellStr
        }).join(',')
      )
    ].join('\n')

    return csvContent
  }

  // Descargar archivo Excel
  const downloadExcel = () => {
    try {
      setIsDownloading(true)
      onDownloadStart?.()

      const csvContent = convertToCSV()
      
      // Crear blob con BOM para Excel (para caracteres especiales)
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      })

      // Crear link de descarga
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      // Generar nombre de archivo con fecha actual
      const now = new Date()
      const dateStr = now.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }).replace(/\//g, '-')
      
      link.setAttribute('href', url)
      link.setAttribute('download', `inscripciones-campamento-${dateStr}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Limpiar URL
      URL.revokeObjectURL(url)
      
      onDownloadComplete?.()
      
    } catch (error) {
      console.error('Error al descargar archivo:', error)
      alert('Error al descargar el archivo. Por favor intenta nuevamente.')
    } finally {
      setIsDownloading(false)
    }
  }

  const totalRecords = youths.length + couples.length
  const totalPeople = youths.length + 
    couples.reduce((sum, couple) => {
      const basePeople = couple.has_partner ? 2 : 1
      return sum + basePeople + (couple.children_count || 0)
    }, 0)

  return (
    <Button 
      onClick={downloadExcel}
      disabled={isDownloading || totalRecords === 0}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
      size="sm"
    >
      {isDownloading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Generando...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Descargar Excel</span>
        </>
      )}
    </Button>
  )
}

// Componente de estadísticas para el dashboard
export function DownloadStats({ youths, couples }: { youths: YouthRegistration[], couples: CoupleRegistration[] }) {
  const totalRecords = youths.length + couples.length
  const totalPeople = youths.length + 
    couples.reduce((sum, couple) => {
      const basePeople = couple.has_partner ? 2 : 1
      return sum + basePeople + (couple.children_count || 0)
    }, 0)

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Users className="w-4 h-4" />
        <span>{youths.length} jóvenes</span>
      </div>
      <div className="flex items-center gap-1">
        <Users2 className="w-4 h-4" />
        <span>{couples.length} parejas</span>
      </div>
      <div className="flex items-center gap-1">
        <FileSpreadsheet className="w-4 h-4" />
        <span>{totalRecords} registros</span>
      </div>
      <div className="font-medium">
        Total: {totalPeople} personas
      </div>
    </div>
  )
}