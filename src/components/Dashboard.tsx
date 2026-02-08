import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Users2, Baby, Car, Bus, Calendar, TrendingUp, Download, FileSpreadsheet } from 'lucide-react'
import { ExcelDownloadButton } from './excel-download'

export function Dashboard() {
  const [youths, setYouths] = useState<any[]>([])
  const [couples, setCouples] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Calcular estadísticas
  const totalYouths = youths.length
  const totalFamilies = couples.length
  const totalChildren = couples.reduce((sum, couple) => sum + (couple.children_count || 0), 0)
  const totalPeople = totalYouths + (totalFamilies * 2) + totalChildren
  
  const mobilityUsers = [...youths, ...couples].filter((r: any) => r.travel_mode === 'movilidad').length
  const busUsers = [...youths, ...couples].filter((r: any) => r.travel_mode === 'bus').length

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  // Efecto para suscribir a cambios en tiempo real
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [youthsData, couplesData] = await Promise.all([
          supabase
            .from('youth_registrations')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('couple_registrations')
            .select('*')
            .order('created_at', { ascending: false })
        ])

        setYouths(youthsData.data || [])
        setCouples(couplesData.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()

    // Suscribir a cambios en tiempo real para jóvenes
    const youthSubscription = supabase
      .channel('youth_registrations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'youth_registrations' },
        (payload) => {
          console.log('Youth registration change:', payload)
          fetchInitialData()
          setLastUpdate(new Date())
        }
      )
      .subscribe()

    // Suscribir a cambios en tiempo real para parejas
    const coupleSubscription = supabase
      .channel('couple_registrations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'couple_registrations' },
        (payload) => {
          console.log('Couple registration change:', payload)
          fetchInitialData()
          setLastUpdate(new Date())
        }
      )
      .subscribe()

    return () => {
      youthSubscription.unsubscribe()
      coupleSubscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando inscripciones...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">
            Campamento Hebrón 2026 - Inscripciones en tiempo real
          </p>
          <Badge variant="secondary" className="text-xs">
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jóvenes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalYouths}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Familias</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFamilies}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Niños</CardTitle>
              <Baby className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalChildren}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Personas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPeople}</div>
            </CardContent>
          </Card>
        </div>

        {/* Modos de viaje */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Movilidad Propia</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mobilityUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Viajan en su propio vehículo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bus Iglesia</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{busUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Viajan en bus delegación
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas y Descarga */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Datos y Descarga
            </CardTitle>
            <ExcelDownloadButton
              youths={youths}
              couples={couples}
              onDownloadStart={() => {
                console.log('📥 Iniciando descarga de datos...')
              }}
              onDownloadComplete={() => {
                console.log('✅ Descarga completada exitosamente')
              }}
            />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Estadísticas actuales:
              </p>
              <div className="flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{totalYouths} jóvenes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users2 className="w-4 h-4" />
                  <span>{totalFamilies} parejas</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{totalYouths + totalFamilies} registros</span>
                </div>
              </div>
              <div className="font-medium text-center">
                Total personas: {totalPeople}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de jóvenes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Jóvenes Registrados ({totalYouths})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {youths.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No hay jóvenes registrados aún
                  </p>
                ) : (
                  youths.map((youth: any, index: number) => (
                    <div 
                      key={youth.id || index} 
                      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{youth.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {youth.phone} • {youth.dni || 'Sin DNI'}
                          </p>
                          {youth.email && (
                            <p className="text-xs text-muted-foreground">
                              {youth.email}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant={youth.travel_mode === 'movilidad' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {youth.travel_mode === 'movilidad' ? '🚗' : '🚌'}
                            </Badge>
                          </div>
                          <div className="mt-1">
                            <Calendar className="inline w-3 h-3 mr-1" />
                            {formatDate(youth.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista de parejas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users2 className="h-5 w-5" />
                Familias Registradas ({totalFamilies})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {couples.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No hay familias registradas aún
                  </p>
                ) : (
                  couples.map((couple: any, index: number) => (
                    <div 
                      key={couple.id || index} 
                      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">
                            {couple.first_name} {couple.last_name}
                            {couple.has_partner && ` + ${couple.partner_first_name} ${couple.partner_last_name}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {couple.phone} • {couple.dni || 'Sin DNI'}
                          </p>
                          {(couple.children_count || 0) > 0 && (
                            <p className="text-xs text-muted-foreground">
                              👶 {couple.children_count} niño(s)
                            </p>
                          )}
                          {couple.email && (
                            <p className="text-xs text-muted-foreground">
                              {couple.email}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant={couple.travel_mode === 'movilidad' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {couple.travel_mode === 'movilidad' ? '🚗' : '🚌'}
                            </Badge>
                            {!couple.has_partner && (
                              <Badge variant="outline" className="text-xs">
                                Solo
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1">
                            <Calendar className="inline w-3 h-3 mr-1" />
                            {formatDate(couple.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* URL del dashboard */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                URL del Dashboard en tiempo real:
              </p>
              <code className="bg-muted px-3 py-2 rounded text-sm">
                {window.location.href}
              </code>
              <p className="text-xs text-muted-foreground">
                Esta página se actualiza automáticamente cada vez que alguien se registra
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}