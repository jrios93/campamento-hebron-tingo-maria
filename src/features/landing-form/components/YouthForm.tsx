
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { youthSchema } from "@/schemas/project"
import z from "zod"
import { createProject } from "@/actions/projects"
import { toast } from "sonner"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const YouthForm = () => {
  const form = useForm<z.infer<typeof youthSchema>>({
    resolver: zodResolver(youthSchema),
    defaultValues: {
      fullName: "",
      age: "",
      phone: "",
      email: "",
      travelMode: undefined,
    },
  })

  const { register, handleSubmit, formState } = form
  const { errors } = formState

  async function onSubmit(data: z.infer<typeof youthSchema>) {
    const res = await createProject(data)
    if (res.success) {
      form.reset()
      toast.success("Información enviada correctamente")
    } else {
      toast.error("Error al enviar la información")
    }
  }

  return (
    <div >

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

        {/* Datos del joven */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">Datos del participante</legend>
          <Field data-invalid={!!errors.fullName}>
            <FieldLabel htmlFor="fullName">Nombre y Apellidos</FieldLabel>
            <Input id="fullName" {...register("fullName")} className="w-full" />
            <FieldError errors={[errors.fullName]} />
          </Field>
          <Field data-invalid={!!errors.age}>
            <FieldLabel htmlFor="age">Edad (mínimo 12 años)</FieldLabel>
            <Input id="age" type="number" {...register("age")} className="w-full" />
            <FieldError errors={[errors.age]} />
          </Field>
        </fieldset>

        {/* Datos de contacto */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">Datos de contacto</legend>
          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="phone">Celular</FieldLabel>
            <Input id="phone" inputMode="numeric" {...register("phone")} className="w-full" />
            <FieldError errors={[errors.phone]} />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
            <Input id="email" type="email" {...register("email")} className="w-full" />
            <FieldError errors={[errors.email]} />
          </Field>
        </fieldset>

        {/* Modo de viaje */}
        <fieldset className="border rounded-md p-4 space-y-2">
          <legend className="font-semibold text-lg px-2">Modo de viaje</legend>
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

        <Button type="submit" className="w-full">Enviar información</Button>
      </form>
    </div>
  )
}

