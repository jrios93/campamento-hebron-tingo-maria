"use server"

import { youthSchema } from "@/schemas/project"
import z from "zod"

export async function createProject(unsafeData: z.infer<typeof youthSchema>) {
  const data = youthSchema.safeParse(unsafeData)

  if (!data.success) return { succes: false }

  return { success: true }
}
