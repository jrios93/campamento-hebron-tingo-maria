import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Manejo más amigable de variables faltantes para desarrollo
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not found')
  console.log('📋 Para desarrollo local, crea un archivo .env.local con:')
  console.log('VITE_SUPABASE_URL=tu-url-de-supabase')
  console.log('VITE_SUPABASE_ANON_KEY=tu-clave-anon')
  console.log('')
  console.log('O copia de .env.example a .env.local')
  
  if (import.meta.env.DEV) {
    console.warn('🔄 Modo desarrollo detectado. Configura tus variables para que funcione correctamente.')
    throw new Error('Por favor configura tus variables de entorno. Revisa la consola para instrucciones.')
  } else {
    throw new Error('Missing Supabase environment variables in production')
  }
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)