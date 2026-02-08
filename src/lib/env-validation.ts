// Validación de variables de entorno para producción
export function validateEnvironment() {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }

  const missing = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missing)
    console.error('Por favor configura estas variables en Vercel Dashboard')
    return false
  }

  // Validar formato de URL
  if (!requiredVars.VITE_SUPABASE_URL?.startsWith('https://')) {
    console.error('❌ VITE_SUPABASE_URL debe ser una URL HTTPS válida')
    return false
  }

  // Validar formato de clave
  if (!requiredVars.VITE_SUPABASE_ANON_KEY?.startsWith('eyJ')) {
    console.error('❌ VITE_SUPABASE_ANON_KEY parece inválida')
    return false
  }

  console.log('✅ Variables de entorno validadas correctamente')
  return true
}

// Validación en tiempo de ejecución
export const isEnvironmentValid = validateEnvironment()