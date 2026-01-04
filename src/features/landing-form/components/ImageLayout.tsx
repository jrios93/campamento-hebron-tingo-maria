import campmentTingo from "/campment/campamento_tingo.jpg"

export const ImageLayout = () => {
  return (
    <div className=" p-6 space-y-6 ">
      <img src={campmentTingo} />
      <div className="hidden md:block">
        <h2 className="text-xl font-semibold mb-4">Estimados hermanos en Cristo</h2>
        <p className="mb-4">
          Recibe el saludo fraterno en el Amor de Cristo, a nombre de la <strong>Iglesia Bíblica Bautista Hebrón</strong>.
          Es para mí un gran privilegio saludarles y extender nuestra invitación al VII Campamento
          <strong> “…Nuestro Dios puede librarnos del horno de fuego..” Daniel 3:17</strong>.
          Sé que muchos de ustedes llegarán aquí con bastante esfuerzo. Pido a Dios en oración que te conceda el privilegio completo de lo que Él tiene reservado para ti en esta semana.
        </p>

        <p className="mb-4">
          La Iglesia Bíblica Bautista Hebrón en cuya autoridad descansa este campamento, ha planificado y organizado este evento que se realizará del <strong>19 al 23 de febrero</strong> en las instalaciones del <strong>Hotel Paraíso Azul – Honolulú</strong>. Con la ayuda del Señor creemos que cada consejero, predicador y líder asignado dará lo mejor de sí para proveer un ambiente adecuado y especial, donde el espíritu del Señor desarrolle en ti su obra.
        </p>

        <p className="mb-2 font-semibold">Información adicional:</p>
        <ul className="list-disc pl-5 mb-4 space-y-1 text-sm text-muted-foreground">
          <li>Pastor del campamento: Pastor Ysaac Felipe Ore Aguilar</li>
          <li>Expositores del campamento:</li>
          <ul className="list-inside list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Paul Rose, Pastor de la Iglesia a manera de la Biblia, Jauja</li>
            <li>Cristian Soto, Pastor de la Primera Iglesia Bautista de Huancayo</li>
            <li>Wilfredo Flores Barrios, Pastor de la Iglesia Bautista Beréa, Lima</li>
            <li>Markos Lindsey, Pastor de la Iglesia Bautista Independiente del Tambo, Huancayo</li>
          </ul>
          <li>A través de la presente queremos animar a los jóvenes, en coordinación con sus pastores y misioneros, a participar de este evento y rogamos sus oraciones.</li>
        </ul>
      </div>
    </div>
  )
}

