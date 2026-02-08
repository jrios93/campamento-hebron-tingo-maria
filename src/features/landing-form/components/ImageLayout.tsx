
import campmentTingo from "/campment/campamento_tingo.jpg"

export const ImageLayout = () => {
  return (
    <div className="p-0 space-y-0 md:p-6 md:space-y-6">
      <div>
        <img src={campmentTingo} className="backdrop-invert-0 w-full" />
        <div className="bg-white/30 backdrop-blur-sm inset-0"></div>
      </div>

      <div className="hidden md:block">
        <h2 className="text-xl font-semibold mb-4">
          Estimados hermanos en Cristo
        </h2>

        <p className="mb-4">
          Reciban un saludo fraterno en el amor de Cristo, a nombre de la{" "}
          <strong>Iglesia Bíblica Bautista Hebrón de Tingo María</strong>.
          Para nosotros es un privilegio saludarles y, a la vez, extenderles una
          cordial invitación al{" "}
          <strong>
            IX Campamento de Jóvenes y Adolescentes y III Campamento de
            Matrimonios
          </strong>
          , bajo el lema{" "}
          <strong>
            “…¿Y por qué uno? Porque buscaba una descendencia para Dios…”
          </strong>{" "}
          (Malaquías 2:15).
        </p>

        <p className="mb-4">
          Este campamento está organizado y respaldado por la autoridad de
          nuestra iglesia; se llevará a cabo del{" "}
          <strong>16 al 20 de febrero</strong> del presente año en las
          instalaciones del{" "}
          <strong>Hotel Paraíso Azul – Honolulú</strong>, ubicado en la
          Carretera Central, antes de llegar a Las Palmas, capital del distrito
          de Mariano Dámaso Beraún.
        </p>


        <p className="mb-4">
          Reconocemos que muchos de ustedes llegarán realizando un esfuerzo
          significativo. Oramos para que el Señor les conceda participar
          plenamente de todo lo que Él tiene preparado para esta semana.
        </p>

      </div>
    </div>
  )
}
