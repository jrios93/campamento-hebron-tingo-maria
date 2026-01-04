import { Header } from "@/components/Header"
import { ImageLayout } from "../components/ImageLayout"
import { SideBySideForm } from "../components/SideBySideForm"

export function LandingPage() {
  return (
    <div className="container px-4 mx-auto my-6 space-y-6">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <ImageLayout />
        <SideBySideForm />
      </div>

    </div>
  )
}

