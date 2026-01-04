
import { z } from "zod"

/* ======================================================
   SCHEMA BASE (CAMPOS COMPARTIDOS)
   ====================================================== */
export const baseSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{9}$/, "El celular debe tener 9 dígitos"),

  email: z
    .string()
    .email("Correo electrónico inválido"),

  travelMode: z.enum(["movilidad", "bus"], {
    required_error: "Debes seleccionar un modo de viaje",
  }),
})

/* ======================================================
   SCHEMA JÓVENES
   ====================================================== */
export const youthSchema = baseSchema.extend({
  fullName: z
    .string()
    .min(1, "El nombre y apellido es obligatorio").regex(/^[\p{L}'’\- ]+$/u
      , "Solo letras, espacios, guiones o apóstrofes"),

  age: z
    .string()
    .min(1, "La edad es obligatoria")
    .regex(/^\d+$/, "La edad debe ser un número")
    .refine(age => {
      const n = Number(age)
      return n >= 12 && n <= 30
    }, {
      message: "La edad debe estar entre 12 y 30 años",
    }),
})

/* ======================================================
   SCHEMA MATRIMONIO
   ====================================================== */
export const coupleSchema = baseSchema.extend({
  /* ---------- ESPOSO ---------- */
  husbandFirstName: z
    .string()
    .min(1, "El nombre del esposo es obligatorio").regex(/^[\p{L}'’\- ]+$/u
      , "Solo letras, espacios, guiones o apóstrofes"),


  husbandLastName: z
    .string()
    .min(1, "El apellido del esposo es obligatorio").regex(/^[\p{L}'’\- ]+$/u
      , "Solo letras, espacios, guiones o apóstrofes"),


  husbandAge: z
    .string()
    .min(1, "La edad del esposo es obligatoria")
    .regex(/^\d+$/, "La edad debe ser un número")
    .refine(age => Number(age) >= 18, {
      message: "La edad debe ser mayor de 18 años",
    }),

  /* ---------- ESPOSA ---------- */
  wifeFirstName: z
    .string()
    .min(1, "El nombre de la esposa es obligatorio").regex(/^[\p{L}'’\- ]+$/u
      , "Solo letras, espacios, guiones o apóstrofes"),

  wifeLastName: z
    .string()
    .min(1, "El apellido de la esposa es obligatorio").regex(/^[\p{L}'’\- ]+$/u
      , "Solo letras, espacios, guiones o apóstrofes"),

  wifeAge: z
    .string()
    .min(1, "La edad de la esposa es obligatoria")
    .regex(/^\d+$/, "La edad debe ser un número")
    .refine(age => Number(age) >= 18, {
      message: "La edad debe ser mayor de 18 años",
    }),

  /* ---------- HIJOS ---------- */

  childrenCount: z
    .number({ message: "Debes indicar cuántos niños te acompañan" })
    .min(0, "No puede ser menor que 0")
    .max(10, "No puede ser mayor que 10")
    .optional(),

})

