import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

export const TimerCount = () => {
  const dateInit = "16/02/2026"
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timerCount = () => {
      const now = new Date();

      // Parse DD/MM/YYYY format manually
      const [day, month, year] = dateInit.split('/');
      const targetDate = new Date(Number(year), Number(month) - 1, Number(day)); // month is 0-indexed

      // Check if date is valid
      if (isNaN(targetDate.getTime())) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const timeDiff = targetDate.getTime() - now.getTime();

      // If target date is in the past, return zeros
      if (timeDiff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      return { days, hours, minutes, seconds };
    }

    // Update countdown immediately
    setCountdown(timerCount());

    // Set up interval to update every second
    const interval = setInterval(() => {
      setCountdown(timerCount());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [dateInit]);

  const { days, hours, minutes, seconds } = countdown;


  return (
    <div className="max-w-xs mx-auto flex items-center justify-center gap-2 md:gap-4 ">
      <div className="text-center space-y-3">
        <Card className="bg-card-foreground">
          <CardContent className="text-center">
            <p className="text-2xl md:text-4xl font-bold text-secondary">
              {days}
            </p>
          </CardContent>
        </Card>
        <p className="text-sm md:text-lg font-medium" >Días</p>
      </div>
      <p className="font-bold text-xl md:text-3xl">:</p> <div className="text-center space-y-3">
        <Card className="bg-card-foreground">
          <CardContent className="text-center">
            <p className="text-2xl md:text-4xl font-bold text-secondary">
              {hours}
            </p>
          </CardContent>
        </Card>
        <p className="text-sm md:text-lg font-medium" >Horas</p>
      </div>
      <p className="font-bold text-xl  md:text-3xl">:</p> <div className="text-center space-y-3">
        <Card className="bg-card-foreground">
          <CardContent className="text-center">
            <p className="text-2xl md:text-4xl font-bold text-secondary">
              {minutes}
            </p>
          </CardContent>
        </Card>
        <p className="text-sm md:text-lg font-medium" >Minutos</p>
      </div>
      <p className="font-bold text-xl md:text-3xl">:</p> <div className="text-center space-y-3">
        <Card className="bg-card-foreground">
          <CardContent className="text-center">
            <p className="text-2xl md:text-4xl font-bold text-secondary">
              {seconds}
            </p>
          </CardContent>
        </Card>
        <p className="text-sm md:text-lg font-medium" >Segundos</p>
      </div>
    </div>
  )
}
