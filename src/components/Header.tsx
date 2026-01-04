
import logo from "../assets/logo/hebron.png";
import { ModeToggle } from "./mode-toggle";

export const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <img src={logo} alt="Logo de Iglesia Bautista" className="w-20 h-20" />
      <div className="flex items-center space-x-4 ">
        <ModeToggle />
        <nav>
          <ul className="flex items-center gap-2">
            <li>Registro</li>
            <li>Galeria</li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

