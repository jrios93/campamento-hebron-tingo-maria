import { Card, CardContent } from "@/components/ui/card"
import { Package, Shirt, Book, Shield, PenTool, Bubbles, ScrollText, BedDouble, Footprints, SprayCan, Church } from "lucide-react"

export const ChecklistSection = () => {
  const items = [
    { icon: Bubbles, text: "Útiles de aseo personal" },
    { icon: ScrollText, text: "Toalla" },
    { icon: BedDouble, text: "Colcha y sábana" },
    { icon: Shirt, text: "Ropa deportiva" },
    { icon: Footprints, text: "Ropa de vestir" },
    { icon: SprayCan, text: "Repelente" },
    { icon: Book, text: "Biblia" },
    { icon: PenTool, text: "Cuaderno y lapicero" },
    { icon: Church, text: "Ropa adecuada para el culto diario" },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              Prepara tu Equipaje
            </h2>
            <p className="text-muted-foreground">
              Cada campero deberá traer:
            </p>
          </div>

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {items.map((item, index) => {
              const IconComponent = item.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="text-center p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
            <p className="text-sm text-muted-foreground italic">
              <span className="font-semibold text-foreground">Importante:</span>
              <br className="md:hidden" />
              <span className="ml-1">Organizado por orden de la iglesia para tu comodidad</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
