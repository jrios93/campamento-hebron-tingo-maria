import { coupleSchema, youthSchema } from "@/schemas/project"
import z from "zod"
import { supabase } from "@/lib/supabase"

type ProjectData = z.infer<typeof coupleSchema> | z.infer<typeof youthSchema>

export async function createProject(unsafeData: ProjectData) {
  let parseResult

  // Detectar qué schema usar
  if ('firstName' in unsafeData) {
    parseResult = coupleSchema.safeParse(unsafeData)
  } else {
    parseResult = youthSchema.safeParse(unsafeData)
  }

  if (!parseResult.success) {
    return { success: false, error: "Validation failed" }
  }

  const validData = parseResult.data

  try {
// Save to Supabase
    if ('firstName' in validData) {
      // Couple registration
      const { error } = await supabase
        .from('couple_registrations')
        .insert({
          first_name: validData.firstName,
          last_name: validData.lastName,
          dni: validData.dni || null,
          birth_date: validData.birthDate,
          has_partner: validData.hasPartner,
          partner_first_name: validData.hasPartner ? validData.partnerFirstName : null,
          partner_last_name: validData.hasPartner ? validData.partnerLastName : null,
          partner_dni: validData.hasPartner ? (validData.partnerDni || null) : null,
          partner_birth_date: validData.hasPartner ? validData.partnerBirthDate : null,
          children_count: validData.childrenCount || 0,
          phone: validData.phone,
          email: validData.email || null,
          travel_mode: validData.travelMode,
        })

      if (error) throw error
    } else {
      // Youth registration
      const { error } = await supabase
        .from('youth_registrations')
        .insert({
          full_name: validData.fullName,
          dni: validData.dni || null,
          birth_date: validData.birthDate,
          phone: validData.phone,
          email: validData.email || null,
          travel_mode: validData.travelMode,
        })

      if (error) throw error
    }

    return { 
      success: true, 
      message: "¡Su registro ha sido completado exitosamente! Hemos recibido su información para el Campamento Hebrón 2026." 
    }

  } catch (error) {
    console.error('Registration error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }
  }
}