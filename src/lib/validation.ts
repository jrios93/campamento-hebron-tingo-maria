import { supabase } from "./supabase"

// Verificar si el DNI ya está registrado
export async function checkDuplicateDni(dni: string, formType: 'youth' | 'couple') {
  if (!dni || dni.length !== 8) return false
  
  try {
    if (formType === 'youth') {
      const { data } = await supabase
        .from('youth_registrations')
        .select('dni')
        .eq('dni', dni)
        .limit(1)
      
      return data && data.length > 0
    } else {
      const { data } = await supabase
        .from('couple_registrations')
        .select('dni')
        .eq('dni', dni)
        .limit(1)
      
      return data && data.length > 0
    }
  } catch (error) {
    console.error('Error checking duplicate DNI:', error)
    return false
  }
}

// Verificar si el teléfono ya está registrado
export async function checkDuplicatePhone(phone: string, formType: 'youth' | 'couple') {
  if (!phone || phone.length !== 9) return false
  
  try {
    if (formType === 'youth') {
      const { data } = await supabase
        .from('youth_registrations')
        .select('phone')
        .eq('phone', phone)
        .limit(1)
      
      return data && data.length > 0
    } else {
      const { data } = await supabase
        .from('couple_registrations')
        .select('phone')
        .eq('phone', phone)
        .limit(1)
      
      return data && data.length > 0
    }
  } catch (error) {
    console.error('Error checking duplicate phone:', error)
    return false
  }
}