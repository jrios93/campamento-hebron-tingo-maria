
import logo from "../assets/logo/hebron.png";
import { ModeToggle } from "./mode-toggle";

export const Header = () => {
  return (
    <div className="w-full px-6 py-3 bg-muted ">
      <div className="container mx-auto flex justify-between items-center gap-2">
        <img src={logo} alt="Logo de Iglesia Bautista" className="w-20 h-20   " />
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-sans ">

            Hebrón – Campamento 2026

          </h1>
          <p className="text-sm sm:text-base font-sans text-muted-foreground">
            Regístrate y recibe todas las indicaciones para el evento
          </p>
        </div>

        <div className="flex justify-end items-center space-x-4 ">
          <ModeToggle />

        </div>
      </div>
    </div>
  );
}

