
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { coupleSchema } from "@/schemas/project"
import z from "zod"
import { createProject } from "@/actions/projects"
import { toast } from "sonner"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export const CoupleForm = () => {
  const form = useForm<z.infer<typeof coupleSchema>>({
    resolver: zodResolver(coupleSchema),
    defaultValues: {
      husbandFirstName: "",
      husbandLastName: "",
      husbandAge: "",
      wifeFirstName: "",
      wifeLastName: "",
      wifeAge: "",
      childrenCount: 0,
      phone: "",
      email: "",
      travelMode: undefined,
    },
  })

  const { register, handleSubmit, formState } = form
  const { errors } = formState

  async function onSubmit(data: z.infer<typeof coupleSchema>) {
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

        {/* Datos del Esposo */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">Datos del Esposo</legend>
          <Field data-invalid={!!errors.husbandFirstName}>
            <FieldLabel htmlFor="husbandFirstName">Nombres</FieldLabel>
            <Input id="husbandFirstName" {...register("husbandFirstName")} className="w-full" />
            <FieldError errors={[errors.husbandFirstName]} />
          </Field>
          <Field data-invalid={!!errors.husbandLastName}>
            <FieldLabel htmlFor="husbandLastName">Apellidos</FieldLabel>
            <Input id="husbandLastName" {...register("husbandLastName")} className="w-full" />
            <FieldError errors={[errors.husbandLastName]} />
          </Field>
          <Field data-invalid={!!errors.husbandAge}>
            <FieldLabel htmlFor="husbandAge">Edad</FieldLabel>
            <Input id="husbandAge" type="number" {...register("husbandAge")} className="w-full" />
            <FieldError errors={[errors.husbandAge]} />
          </Field>
        </fieldset>

        {/* Datos de la Esposa */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">Datos de la Esposa</legend>
          <Field data-invalid={!!errors.wifeFirstName}>
            <FieldLabel htmlFor="wifeFirstName">Nombres</FieldLabel>
            <Input id="wifeFirstName" {...register("wifeFirstName")} className="w-full" />
            <FieldError errors={[errors.wifeFirstName]} />
          </Field>
          <Field data-invalid={!!errors.wifeLastName}>
            <FieldLabel htmlFor="wifeLastName">Apellidos</FieldLabel>
            <Input id="wifeLastName" {...register("wifeLastName")} className="w-full" />
            <FieldError errors={[errors.wifeLastName]} />
          </Field>
          <Field data-invalid={!!errors.wifeAge}>
            <FieldLabel htmlFor="wifeAge">Edad</FieldLabel>
            <Input id="wifeAge" type="number" {...register("wifeAge")} className="w-full" />
            <FieldError errors={[errors.wifeAge]} />
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
              {...register("childrenCount")}
              className="w-full"
            />
            <FieldError errors={[errors.childrenCount]} />
          </Field>
        </fieldset>

        {/* Modo de viaje */}
        <fieldset className="border rounded-md p-4 space-y-4">
          <legend className="font-semibold text-lg px-2">Modo de viaje</legend>
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

        <Button type="submit" className="w-full">Enviar información</Button>
      </form>
    </div>
  )
}

