
import { coupleSchema, youthSchema } from "@/schemas/project"
import z from "zod"

type ProjectData = z.infer<typeof coupleSchema> | z.infer<typeof youthSchema>

export async function createProject(unsafeData: ProjectData) {
  let parseResult

  // Detectar qué schema usar
  if ('husbandFirstName' in unsafeData) {
    parseResult = coupleSchema.safeParse(unsafeData)
  } else {
    parseResult = youthSchema.safeParse(unsafeData)
  }

  if (!parseResult.success) return { success: false }
  return { success: true }
}

