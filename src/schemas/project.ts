import { z } from "zod"

/* ======================================================
   SCHEMA BASE (CAMPOS COMPARTIDOS)
   ====================================================== */
export const baseSchema = z.object({
  dni: z
    .string()
    .regex(/^\d{8}$/, "El DNI debe tener 8 dígitos")
    .optional()
    .or(z.literal("")),

  birthDate: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine(date => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed < new Date();
    }, "La fecha de nacimiento debe ser válida y anterior a hoy"),

  phone: z
    .string()
    .regex(/^\d{9}$/, "El celular debe tener 9 dígitos"),

  email: z
    .string()
    .email("Correo electrónico inválido")
    .optional()
    .or(z.literal("")),

  travelMode: z.enum(["movilidad", "bus"] as const, {
    message: "Debes seleccionar un modo de viaje",
  }),
})

/* ======================================================
   SCHEMA JÓVENES
   ====================================================== */
export const youthSchema = baseSchema.extend({
  fullName: z
    .string()
    .min(1, "El nombre y apellido es obligatorio")
    .regex(/^[\p{L}'’\- ]+$/u, "Solo letras, espacios, guiones o apóstrofes"),

  birthDate: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine(date => {
      let parsed: Date;
      
      // Intentar formato YYYY-MM-DD (backend) o DD/MM/YYYY (frontend)
      if (date.includes('-')) {
        // Formato YYYY-MM-DD
        parsed = new Date(date);
      } else if (date.includes('/')) {
        // Formato DD/MM/YYYY
        const parts = date.split('/');
        if (parts.length !== 3) return false;
        
        const [dd, mm, yyyy] = parts;
        const day = parseInt(dd);
        const month = parseInt(mm);
        const year = parseInt(yyyy);
        
        if (day > 31 || month > 12 || year < 1900 || year > 2100) return false;
        
        parsed = new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
      } else {
        return false;
      }
      
      const today = new Date();
      const age = today.getFullYear() - parsed.getFullYear();
      const monthDiff = today.getMonth() - parsed.getMonth();
      const dayDiff = today.getDate() - parsed.getDate();

      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      return !isNaN(parsed.getTime()) && parsed < today && actualAge >= 12 && actualAge <= 40;
    }, "La edad debe estar entre 12 y 40 años"),
})

/* ======================================================
   SCHEMA MATRIMONIO
   ====================================================== */
export const coupleSchema = baseSchema.extend({
  /* ---------- DATOS DEL PARTICIPANTE PRINCIPAL ---------- */
  firstName: z
    .string()
    .min(1, "El nombre es obligatorio")
    .regex(/^[\p{L}'’\- ]+$/u, "Solo letras, espacios, guiones o apóstrofes"),

  lastName: z
    .string()
    .min(1, "El apellido es obligatorio")
    .regex(/^[\p{L}'’\- ]+$/u, "Solo letras, espacios, guiones o apóstrofes"),

  birthDate: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine(date => {
      const parsed = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - parsed.getFullYear();
      const monthDiff = today.getMonth() - parsed.getMonth();
      const dayDiff = today.getDate() - parsed.getDate();

      const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      return !isNaN(parsed.getTime()) && parsed < today && actualAge >= 18;
    }, "Debes ser mayor de 18 años"),

  /* ---------- ¿VIENE ACOMPAÑADO? ---------- */
  hasPartner: z.boolean(),

  /* ---------- DATOS DE LA PAREJA ---------- */
  partnerFirstName: z
    .string()
    .regex(/^[\p{L}'’\- ]*$/u, "Solo letras, espacios, guiones o apóstrofes")
    .optional(),

  partnerLastName: z
    .string()
    .regex(/^[\p{L}'’\- ]*$/u, "Solo letras, espacios, guiones o apóstrofes")
    .optional(),

  partnerDni: z
    .string()
    .regex(/^\d{8}$/, "El DNI debe tener 8 dígitos")
    .optional()
    .or(z.literal("")),

  partnerBirthDate: z
    .string()
    .optional()
    .refine((date: string | undefined) => !date || (
      !isNaN(new Date(date).getTime()) &&
      new Date(date) < new Date() &&
      (new Date().getFullYear() - new Date(date).getFullYear() >= 18)
    ), {
      message: "La pareja debe ser mayor de 18 años",
    }),

  /* ---------- HIJOS ---------- */
  childrenCount: z
    .number({ message: "Debes indicar cuántos niños te acompañan" })
    .min(0, "No puede ser menor que 0")
    .max(10, "No puede ser mayor que 10")
    .optional(),

}).refine(data => {
  // Si tiene pareja, los campos de la pareja son obligatorios
  if (data.hasPartner) {
    return data.partnerFirstName && data.partnerLastName &&
      data.partnerDni && data.partnerBirthDate;
  }
  return true;
}, {
  message: "Los datos de la pareja son obligatorios cuando selecciona que viene acompañado",
  path: ["partnerFirstName"],
})
