
import logo from "../assets/logo/logohebron.webp";

export const Header = () => {
  return (
    <div className="w-full px-6 py-3 bg-muted ">
      <div className="container mx-auto flex justify-center items-center gap-6">
        <img src={logo} alt="Logo de Iglesia Bautista" className="h-20 w-auto  " />
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-sans ">

            Campamento 2026

          </h1>
          <p className="text-sm sm:text-base font-sans text-muted-foreground">
            Regístrate y recibe todas las indicaciones para el evento
          </p>
        </div>


      </div>
    </div>
  );
}

