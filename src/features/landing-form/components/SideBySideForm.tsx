import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { YouthForm } from "../components/YouthForm"
import { CoupleForm } from "../components/CoupleForm"

export function SideBySideForm() {
  return (
    <div >
      <Tabs defaultValue="youth">
        <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
          <TabsTrigger value="youth">Jóvenes</TabsTrigger>
          <TabsTrigger value="couple">Matrimonios</TabsTrigger>
        </TabsList>
        <TabsContent value="youth">
          <Card>
            <CardHeader>
              <CardTitle className="uppercase">IX Campamento de Jóvenes y Adolescentes</CardTitle>

              <CardDescription className="space-y-4">
                {/* Qué es */}
                <p>
                  Este campamento es organizado por la <strong>Iglesia Bíblica Bautista Hebrón</strong> y se realizará del
                  <strong> 16 </strong> al <strong>20</strong> de <strong>febrero</strong> en las instalaciones del
                  <strong> Hotel Paraíso Azul – Honolulú</strong>.
                </p>

                {/* Requisitos */}
                <div>
                  <p className="font-medium text-sm">Requisitos:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    <li>Edad mínima: 12 años cumplidos.</li>
                  </ul>
                </div>

                {/* Costo */}
                <p className="font-medium">
                  Costo por campamentista: <span className="font-semibold">S/ 100</span>
                </p>

                {/* Acción */}
                <p className="text-sm text-muted-foreground">
                  Completa el siguiente formulario para registrar tu participación.
                </p>
              </CardDescription>


            </CardHeader>
            <CardContent className="grid gap-6">
              <YouthForm />
            </CardContent>



          </Card>
        </TabsContent>
        <TabsContent value="couple">
          <Card>
            <CardHeader>
              <CardTitle> III CAMPAMENTO DE MATRIMONIOS</CardTitle>

              <CardDescription className="space-y-4">
                {/* Qué es */}
                <p>
                  Este campamento es organizado por la <strong>Iglesia Bíblica Bautista Hebrón</strong> y se realizará del
                  <strong> 16 </strong> al <strong>20</strong> de <strong>febrero</strong> en las instalaciones del
                  <strong> Hotel Paraíso Azul – Honolulú</strong>.
                </p>



                {/* Costo */}
                <p className="font-medium">
                  Costo por Matrimonio(pareja): <span className="font-semibold">S/ 200</span>
                </p>

                {/* Acción */}
                <p className="text-sm text-muted-foreground">
                  Completa el siguiente formulario para registrar tu participación.
                </p>
              </CardDescription>


            </CardHeader>
            <CardContent className="grid gap-6">
              <CoupleForm />
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

