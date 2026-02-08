import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { coupleSchema } from "@/schemas/project"
import z from "zod"
import { createProject } from "@/actions/projects"
import { toast } from "sonner"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DateInput } from "@/components/ui/date-input"
import { Controller } from "react-hook-form"

export const CoupleForm = () => {
  const form = useForm<z.infer<typeof coupleSchema>>({
    resolver: zodResolver(coupleSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dni: "",
      birthDate: "",
      hasPartner: false,
      partnerFirstName: "",
      partnerLastName: "",
      partnerDni: "",
      partnerBirthDate: "",
      childrenCount: 0,
      phone: "",
      email: "",
      travelMode: undefined,
    },
  })

  const { register, handleSubmit, formState, watch } = form
  const { errors } = formState
  
  // Watch for hasPartner changes to show/hide partner fields
  const hasPartner = watch("hasPartner")

  async function onSubmit(data: z.infer<typeof coupleSchema>) {
    const res = await createProject(data)
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

        {/* Datos del participante principal */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">Tus datos</legend>
          
          {/* Documento de Identidad primero */}
          <Field data-invalid={!!errors.dni}>
            <FieldLabel htmlFor="dni">Documento de Identidad (DNI) - Opcional</FieldLabel>
            <Input id="dni" inputMode="numeric" maxLength={8} {...register("dni")} className="w-full" />
            <FieldError errors={[errors.dni]} />
            <p className="text-xs text-muted-foreground mt-1">
              * Si eres extranjero puedes dejar este campo vacío
            </p>
          </Field>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field data-invalid={!!errors.firstName}>
              <FieldLabel htmlFor="firstName">Nombres *</FieldLabel>
              <Input id="firstName" {...register("firstName")} className="w-full" />
              <FieldError errors={[errors.firstName]} />
            </Field>
            <Field data-invalid={!!errors.lastName}>
              <FieldLabel htmlFor="lastName">Apellidos *</FieldLabel>
              <Input id="lastName" {...register("lastName")} className="w-full" />
              <FieldError errors={[errors.lastName]} />
            </Field>
          </div>
          
          <Field data-invalid={!!errors.birthDate}>
            <FieldLabel htmlFor="birthDate">Fecha de Nacimiento *</FieldLabel>
            <Controller
              name="birthDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <DateInput
                  id="birthDate"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="DD/MM/AAAA"
                  error={fieldState.error?.message}
                  required
                />
              )}
            />
          </Field>
        </fieldset>

        {/* ¿Viene acompañado? */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">¿Viene acompañado de su pareja?</legend>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register("hasPartner")} />
            Sí, vengo con mi pareja
          </label>
        </fieldset>

        {/* Datos de la pareja */}
        {hasPartner && (
          <fieldset className="border rounded-md p-4 space-y-4">
            <legend className="font-semibold text-lg px-2">Datos de tu pareja</legend>
            
            {/* Documento de Identidad primero */}
            <Field data-invalid={!!errors.partnerDni}>
              <FieldLabel htmlFor="partnerDni">Documento de Identidad (DNI) - Opcional</FieldLabel>
              <Input id="partnerDni" inputMode="numeric" maxLength={8} {...register("partnerDni")} className="w-full" />
              <FieldError errors={[errors.partnerDni]} />
              <p className="text-xs text-muted-foreground mt-1">
                * Si es extranjero puede dejar este campo vacío
              </p>
            </Field>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.partnerFirstName}>
                <FieldLabel htmlFor="partnerFirstName">Nombres *</FieldLabel>
                <Input id="partnerFirstName" {...register("partnerFirstName")} className="w-full" />
                <FieldError errors={[errors.partnerFirstName]} />
              </Field>
              <Field data-invalid={!!errors.partnerLastName}>
                <FieldLabel htmlFor="partnerLastName">Apellidos *</FieldLabel>
                <Input id="partnerLastName" {...register("partnerLastName")} className="w-full" />
                <FieldError errors={[errors.partnerLastName]} />
              </Field>
            </div>
            
            <Field data-invalid={!!errors.partnerBirthDate}>
              <FieldLabel htmlFor="partnerBirthDate">Fecha de Nacimiento *</FieldLabel>
              <Controller
                name="partnerBirthDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <DateInput
                    id="partnerBirthDate"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="DD/MM/AAAA"
                    error={fieldState.error?.message}
                    required
                  />
                )}
              />
            </Field>
          </fieldset>
        )}

        {/* Datos de contacto */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">Datos de contacto</legend>
          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="phone">Celular *</FieldLabel>
            <Input id="phone" inputMode="numeric" {...register("phone")} className="w-full" />
            <FieldError errors={[errors.phone]} />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Correo electrónico - Opcional</FieldLabel>
            <Input id="email" type="email" {...register("email")} className="w-full" />
            <FieldError errors={[errors.email]} />
            <p className="text-xs text-muted-foreground mt-1">
              * Recomendado para recibir notificaciones del evento
            </p>
          </Field>
        </fieldset>

        {/* Viaja con menores */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">Viaja con menores</legend>
          <Field data-invalid={!!errors.childrenCount}>
            <FieldLabel htmlFor="childrenCount">Cantidad de niños que los acompañan</FieldLabel>
            <Input
              id="childrenCount"
              type="number"
              min={0}
              max={10}
              {...register("childrenCount", { valueAsNumber: true })}
              className="w-full"
            />
            <FieldError errors={[errors.childrenCount]} />
          </Field>
        </fieldset>

        {/* Modo de viaje */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">Modo de viaje *</legend>
          <Field data-invalid={!!errors.travelMode}>
            <label className="flex items-center gap-2">
              <input type="radio" value="movilidad" {...register("travelMode")} />
              Movilidad propia
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="bus" {...register("travelMode")} />
              Bus (delegación de la iglesia)
            </label>
            <FieldError errors={[errors.travelMode]} />
          </Field>
        </fieldset>

        {/* Nota sobre campos obligatorios */}
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p className="font-medium mb-1">Información importante:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Los campos marcados con * son obligatorios</li>
            <li>La fecha de nacimiento debe ser real (se validará que seas mayor de 18 años)</li>
            <li>Si no tienes DNI por ser extranjero, puedes dejar el campo vacío</li>
            <li>El correo electrónico es opcional pero recomendado para recibir notificaciones</li>
            {hasPartner && <li>Si seleccionaste venir con pareja, sus datos son obligatorios</li>}
          </ul>
        </div>

        <Button type="submit" className="w-full">Enviar información</Button>
      </form>
    </div>
  )
}