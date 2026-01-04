import { Header } from "@/components/Header"
import { ImageLayout } from "../components/ImageLayout"
import { SideBySideForm } from "../components/SideBySideForm"
import { TimerCount } from "../components/TimerCount"

export function LandingPage() {
  return (
    <div className="space-y-0 md:space-y-12">
      <Header />
      <div className="max-w-full md:container px-0 md:px-4 mx-auto space-y-12 ">
        <TimerCount />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ImageLayout />
          <SideBySideForm />
        </div>
      </div>

    </div>
  )
}

