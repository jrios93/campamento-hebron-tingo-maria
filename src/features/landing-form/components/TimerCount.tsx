import { Card, CardContent } from "@/components/ui/card"

export const TimerCount = () => {
  return (
    <div className="max-w-xs mx-auto flex items-center justify-center gap-2 md:gap-4 ">
      <div className="text-center space-y-3">
        <Card className="bg-card-foreground">
          <CardContent className="text-center">
            <p className="text-2xl md:text-4xl font-bold text-secondary">
              12
            </p>
          </CardContent>
        </Card>
        <p className="text-sm md:text-lg font-medium" >Días</p>
      </div>
      <p className="font-bold text-xl md:text-3xl">:</p> <div className="text-center space-y-3">
        <Card className="bg-card-foreground">
          <CardContent className="text-center">
            <p className="text-2xl md:text-4xl font-bold text-secondary">
              12
            </p>
          </CardContent>
        </Card>
        <p className="text-sm md:text-lg font-medium" >Horas</p>
      </div>
      <p className="font-bold text-xl  md:text-3xl">:</p> <div className="text-center space-y-3">
        <Card className="bg-card-foreground">
          <CardContent className="text-center">
            <p className="text-2xl md:text-4xl font-bold text-secondary">
              12
            </p>
          </CardContent>
        </Card>
        <p className="text-sm md:text-lg font-medium" >Minutos</p>
      </div>
      <p className="font-bold text-xl md:text-3xl">:</p> <div className="text-center space-y-3">
        <Card className="bg-card-foreground">
          <CardContent className="text-center">
            <p className="text-2xl md:text-4xl font-bold text-secondary">
              12
            </p>
          </CardContent>
        </Card>
        <p className="text-sm md:text-lg font-medium" >Segundos</p>
      </div>
    </div>
  )
}

