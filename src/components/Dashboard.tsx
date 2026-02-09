import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Users2, Baby, Car, Bus, Calendar, TrendingUp, Download, FileSpreadsheet, Search, AlertTriangle } from 'lucide-react'
import { ExcelDownloadButton } from './excel-download'

export function Dashboard() {
  const [youths, setYouths] = useState<any[]>([])
  const [couples, setCouples] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [youthSearchTerm, setYouthSearchTerm] = useState('')
  const [coupleSearchTerm, setCoupleSearchTerm] = useState('')

  // Calcular estadísticas
  const totalYouths = youths.length
  const totalFamilies = couples.length
  const couplesWithPartner = couples.filter(couple => couple.has_partner).length
  const couplesAlone = couples.filter(couple => !couple.has_partner).length
  const totalAdults = couples.filter(couple => couple.has_partner).length * 2 + couples.filter(couple => !couple.has_partner).length * 1
  const totalChildren = couples.reduce((sum, couple) => sum + (couple.children_count || 0), 0)
  const totalPeople = totalYouths + totalAdults + totalChildren

  const mobilityUsers = [...youths, ...couples].filter((r: any) => r.travel_mode === 'movilidad').length
  const busUsers = [...youths, ...couples].filter((r: any) => r.travel_mode === 'bus').length
  
  // Desglose detallado para bus
  const youthsInBus = youths.filter((y: any) => y.travel_mode === 'bus').length

  const couplesWithPartnerInBus = couples.filter((c: any) => c.travel_mode === 'bus' && c.has_partner).length
  const couplesAloneInBus = couples.filter((c: any) => c.travel_mode === 'bus' && !c.has_partner).length
  const adultsInBus = couplesWithPartnerInBus * 2 + couplesAloneInBus * 1
  const childrenInBus = couples.filter((c: any) => c.travel_mode === 'bus').reduce((sum, couple) => sum + (couple.children_count || 0), 0)
  const totalPeopleInBus = youthsInBus + adultsInBus + childrenInBus
  
  // Desglose detallado para movilidad propia
  const youthsInMobility = youths.filter((y: any) => y.travel_mode === 'movilidad').length
  const couplesWithPartnerInMobility = couples.filter((c: any) => c.travel_mode === 'movilidad' && c.has_partner).length
  const couplesAloneInMobility = couples.filter((c: any) => c.travel_mode === 'movilidad' && !c.has_partner).length
  const adultsInMobility = couplesWithPartnerInMobility * 2 + couplesAloneInMobility * 1
  const childrenInMobility = couples.filter((c: any) => c.travel_mode === 'movilidad').reduce((sum, couple) => sum + (couple.children_count || 0), 0)
  const totalPeopleInMobility = youthsInMobility + adultsInMobility + childrenInMobility
  
  // Función para calcular edad
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    const dayDiff = today.getDate() - birth.getDate()
    return monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age
  }
  
  // Calcular edades
  const youthAges = youths.map(y => calculateAge(y.birth_date)).sort((a, b) => a - b)
  const adultAges = couples.flatMap(c => {
    const mainAge = calculateAge(c.birth_date)
    if (c.has_partner && c.partner_birth_date) {
      return [mainAge, calculateAge(c.partner_birth_date)]
    }
    return [mainAge]
  }).sort((a, b) => a - b)
  
  // Estadísticas de edad
  const youthAgeRange = youthAges.length > 0 ? `${Math.min(...youthAges)}-${Math.max(...youthAges)} años` : 'N/A'
  const adultAgeRange = adultAges.length > 0 ? `${Math.min(...adultAges)}-${Math.max(...adultAges)} años` : 'N/A'
  const youthAvgAge = youthAges.length > 0 ? Math.round(youthAges.reduce((a, b) => a + b, 0) / youthAges.length) : 0
  const adultAvgAge = adultAges.length > 0 ? Math.round(adultAges.reduce((a, b) => a + b, 0) / adultAges.length) : 0
  
  // Filtrar por búsqueda
  const filteredYouths = youths.filter(y => 
    y.full_name?.toLowerCase().includes(youthSearchTerm.toLowerCase()) ||
    y.dni?.includes(youthSearchTerm) ||
    y.phone?.includes(youthSearchTerm)
  )
  
  const filteredCouples = couples.filter(c => 
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(coupleSearchTerm.toLowerCase()) ||
    c.dni?.includes(coupleSearchTerm) ||
    c.phone?.includes(coupleSearchTerm) ||
    (c.has_partner && `${c.partner_first_name} ${c.partner_last_name}`.toLowerCase().includes(coupleSearchTerm.toLowerCase()))
  )

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
              <p className="text-xs text-muted-foreground mt-1">
                {couplesWithPartner} parejas • {couplesAlone} solo
              </p>
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
              <p className="text-xs text-muted-foreground mt-1">
                Total de participantes
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>👦 Jóvenes:</span>
                  <span className="font-medium">{totalYouths}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>👨‍👩‍👧‍👦 Adultos:</span>
                  <span className="font-medium">{totalAdults}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>👶 Niños:</span>
                  <span className="font-medium">{totalChildren}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Perfil de Edades */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Perfil de Edades
            </CardTitle>
            {(adultAvgAge > 40 || youthAvgAge > 30) && (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Perfil mayor
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Jóvenes</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Rango de edad:</span>
                    <span className="font-medium">{youthAgeRange}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Promedio:</span>
                    <span className="font-medium">{youthAvgAge} años</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Adultos (Familias)</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Rango de edad:</span>
                    <span className="font-medium">{adultAgeRange}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Promedio:</span>
                    <span className="font-medium">{adultAvgAge} años</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modos de viaje */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Movilidad Propia</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPeopleInMobility}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {mobilityUsers} registros • {totalPeopleInMobility} personas
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>👦 Jóvenes:</span>
                  <span className="font-medium">{youthsInMobility}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>👨‍👩‍👧‍👦 Familias:</span>
                  <span className="font-medium">{couplesWithPartnerInMobility} parejas • {couplesAloneInMobility} solo</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>👶 Niños:</span>
                  <span className="font-medium">{childrenInMobility}</span>
                </div>
                <div className="flex justify-between text-xs font-medium border-t pt-1">
                  <span>Total personas:</span>
                  <span>{totalPeopleInMobility}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bus Iglesia</CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPeopleInBus}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {busUsers} registros • {totalPeopleInBus} personas
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>👦 Jóvenes:</span>
                  <span className="font-medium">{youthsInBus}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>👨‍👩‍👧‍👦 Familias:</span>
                  <span className="font-medium">{couplesWithPartnerInBus} parejas • {couplesAloneInBus} solo</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>👶 Niños:</span>
                  <span className="font-medium">{childrenInBus}</span>
                </div>
                <div className="flex justify-between text-xs font-medium border-t pt-1">
                  <span>Total personas:</span>
                  <span>{totalPeopleInBus}</span>
                </div>
              </div>
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
                  <span>{totalFamilies} familias</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{totalYouths + totalFamilies} registros</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{totalAdults} adultos</span>
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
              <div className="flex items-center gap-2 mt-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar joven..."
                  value={youthSearchTerm}
                  onChange={(e) => setYouthSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                 {filteredYouths.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No hay jóvenes registrados aún
                  </p>
                ) : (
                  filteredYouths.map((youth: any, index: number) => (
                    <div
                      key={youth.id || index}
                      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{youth.full_name}</p>
                            <Badge variant="outline" className="text-xs">
                              {calculateAge(youth.birth_date)} años
                            </Badge>
                          </div>
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
                <Badge variant="outline" className="text-xs">
                  {couplesWithPartner} parejas • {couplesAlone} solo
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar familia..."
                  value={coupleSearchTerm}
                  onChange={(e) => setCoupleSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {couples.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No hay familias registradas aún
                  </p>
                ) : (
                  filteredCouples.map((couple: any, index: number) => (
                    <div
                      key={couple.id || index}
                      className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="font-medium">
                                {couple.first_name} {couple.last_name}
                                {couple.has_partner && ` + ${couple.partner_first_name} ${couple.partner_last_name}`}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {calculateAge(couple.birth_date)} años
                                </Badge>
                                {couple.has_partner && couple.partner_birth_date && (
                                  <Badge variant="outline" className="text-xs">
                                    {calculateAge(couple.partner_birth_date)} años
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
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
