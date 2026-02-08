import { Header } from "@/components/Header"
import { ImageLayout } from "../components/ImageLayout"
import { SideBySideForm } from "../components/SideBySideForm"
import { TimerCount } from "../components/TimerCount"
import { ChecklistSection } from "@/components/ChecklistSection"

export function LandingPage() {
  return (
    <div className="space-y-0 md:space-y-12">
      <Header />
      <div className="max-w-full md:container px-0 md:px-4 mx-auto space-y-12 ">
        <TimerCount />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <ImageLayout />
            <div className="hidden md:flex">
              <ChecklistSection />
            </div>
          </div>
          <div>
            <SideBySideForm />
            <div className="flex md:hidden">
              <ChecklistSection />
            </div>
          </div>
        </div>

        {/* Checklist Section - Full width */}
      </div>

    </div>
  )
}

