import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { youthSchema } from "@/schemas/project"
import z from "zod"
import { createProject } from "@/actions/projects"
import { toast } from "sonner"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { checkDuplicateDni, checkDuplicatePhone } from "@/lib/validation"

export const YouthForm = () => {
  const [dniError, setDniError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  const form = useForm<z.infer<typeof youthSchema>>({
    resolver: zodResolver(youthSchema),
    defaultValues: {
      fullName: "",
      dni: "",
      birthDate: "",
      phone: "",
      email: "",
      travelMode: undefined,
    },
  })

  const { handleSubmit, formState, watch, register } = form
  const { errors } = formState

  const dniValue = watch("dni")
  const phoneValue = watch("phone")

  // Validación en tiempo real de DNI
  useEffect(() => {
    const validateDni = async () => {
      if (dniValue && dniValue.length === 8) {
        setIsValidating(true)
        const isDuplicate = await checkDuplicateDni(dniValue, 'youth')
        setDniError(isDuplicate ? "Este DNI ya está registrado" : "")
        setIsValidating(false)
      } else {
        setDniError("")
      }
    }

    const debounceTimer = setTimeout(validateDni, 500)
    return () => clearTimeout(debounceTimer)
  }, [dniValue])

  // Validación en tiempo real de teléfono
  useEffect(() => {
    const validatePhone = async () => {
      if (phoneValue && phoneValue.length === 9) {
        setIsValidating(true)
        const isDuplicate = await checkDuplicatePhone(phoneValue, 'youth')
        setPhoneError(isDuplicate ? "Este teléfono ya está registrado" : "")
        setIsValidating(false)
      } else {
        setPhoneError("")
      }
    }

    const debounceTimer = setTimeout(validatePhone, 500)
    return () => clearTimeout(debounceTimer)
  }, [phoneValue])

  // Función para convertir DD/MM/YYYY a YYYY-MM-DD
  const convertDateFormat = (dateString: string) => {
    if (!dateString) return ""
    
    // Remover todo excepto números y barras
    const cleaned = dateString.replace(/[^\d/]/g, '')
    
    // Dividir la fecha
    const parts = cleaned.split('/')
    
    // Verificar que tengamos día, mes y año
    if (parts.length !== 3) return dateString
    
    const [dd, mm, yyyy] = parts
    
    // Validar rangos
    const day = parseInt(dd)
    const month = parseInt(mm)
    const year = parseInt(yyyy)
    
    if (day > 31 || month > 12 || year < 1900 || year > 2100) {
      return dateString
    }
    
    // Retornar en formato YYYY-MM-DD para el backend
    return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  async function onSubmit(data: z.infer<typeof youthSchema>) {
    // Convertir la fecha antes de enviar
    const formattedData = {
      ...data,
      birthDate: convertDateFormat(data.birthDate)
    }
    
    const res = await createProject(formattedData)
    if (res.success) {
      form.reset()
      toast.success(res.message || "¡Su registro ha sido completado exitosamente!")
    } else {
      toast.error(res.error || "Error al procesar su registro. Por favor intente nuevamente.")
    }
  }

  return (
    <div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

        {/* Datos del joven */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">Datos del participante</legend>
          
          {/* Documento de Identidad primero */}
          <Field data-invalid={!!errors.dni || !!dniError}>
            <FieldLabel htmlFor="dni">Documento de Identidad (DNI) - Opcional</FieldLabel>
            <Input 
              id="dni" 
              inputMode="numeric" 
              maxLength={8} 
              {...register("dni")} 
              className="w-full"
              placeholder="Ej: 12345678"
            />
            <FieldError errors={[errors.dni]} />
            {dniError && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                ⚠️ {dniError}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              * Si eres extranjero puedes dejar este campo vacío
            </p>
          </Field>

          <Field data-invalid={!!errors.fullName}>
            <FieldLabel htmlFor="fullName">Nombre y Apellidos *</FieldLabel>
            <Input id="fullName" {...register("fullName")} className="w-full" />
            <FieldError errors={[errors.fullName]} />
          </Field>
          
          <Field data-invalid={!!errors.birthDate}>
            <FieldLabel htmlFor="birthDate">Fecha de Nacimiento *</FieldLabel>
            <Input 
              id="birthDate" 
              type="text"
              {...register("birthDate")} 
              className="w-full"
              placeholder="DD/MM/AAAA (ej: 15/01/2010)"
            />
            <FieldError errors={[errors.birthDate]} />
            <p className="text-xs text-muted-foreground mt-1">
              * Formato: Día/Mes/Año (ej: 15/01/2010) - Para jóvenes de 12 a 30 años
            </p>
          </Field>
        </fieldset>

        {/* Datos de contacto */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">Datos de contacto</legend>
          <Field data-invalid={!!errors.phone || !!phoneError}>
            <FieldLabel htmlFor="phone">Celular *</FieldLabel>
            <Input 
              id="phone" 
              inputMode="numeric" 
              {...register("phone")} 
              className="w-full"
              placeholder="Ej: 987654321"
            />
            <FieldError errors={[errors.phone]} />
            {phoneError && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                ⚠️ {phoneError}
              </p>
            )}
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Correo electrónico - Opcional</FieldLabel>
            <Input id="email" type="email" {...register("email")} className="w-full" />
            <FieldError errors={[errors.email]} />
          </Field>
        </fieldset>

        {/* Modo de viaje */}
        <fieldset className="border rounded-md p-4 space-y-2">
          <legend className="font-semibold text-lg px-2">Modo de viaje *</legend>
          <label className="flex items-center gap-2">
            <input type="radio" value="movilidad" {...register("travelMode")} />
            Movilidad propia
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="bus" {...register("travelMode")} />
            Bus (delegación de la iglesia)
          </label>
          <FieldError errors={[errors.travelMode]} />
        </fieldset>

        {/* Nota sobre campos obligatorios */}
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p className="font-medium mb-1">Información importante:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Los campos marcados con * son obligatorios</li>
            <li>La fecha de nacimiento debe ser real (se validará la edad entre 12 y 30 años)</li>
            <li>Formato de fecha: DD/MM/AAAA (día/mes/año)</li>
            <li>Si no tienes DNI por ser extranjero, puedes dejar el campo vacío</li>
            <li>El correo electrónico es opcional pero recomendado para recibir notificaciones</li>
          </ul>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isValidating || !!dniError || !!phoneError}
        >
          {isValidating ? "Validando datos..." : "Enviar información"}
        </Button>
      </form>
    </div>
  )
}