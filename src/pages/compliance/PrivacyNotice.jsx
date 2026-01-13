// pages/compliance/PrivacyNotice.jsx
/**
 * Página de Aviso de Privacidad Integral.
 * 
 * Esta página muestra el Aviso de Privacidad completo de acuerdo con
 * los requisitos de la LFPDPPP. Es accesible públicamente sin necesidad
 * de autenticación.
 * 
 * Ruta: /aviso-de-privacidad
 */

import { ArrowLeft, Shield, FileText, Scale, Lock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * Versión actual del Aviso de Privacidad.
 * Debe coincidir con CURRENT_PRIVACY_POLICY_VERSION en el backend.
 */
const PRIVACY_POLICY_VERSION = '1.0.0';
const LAST_UPDATE_DATE = '13 de enero de 2025';

export function PrivacyNotice() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">Amalitica</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Versión {PRIVACY_POLICY_VERSION}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Aviso de Privacidad Integral</h1>
          <p className="text-muted-foreground">
            Última actualización: {LAST_UPDATE_DATE}
          </p>
        </div>

        {/* Notice for Business Owners */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800">
              <strong>Nota para el Propietario de la Óptica:</strong> Este es un documento 
              plantilla que usted debe adoptar y personalizar. Reemplace los campos marcados 
              entre corchetes con su propia información. Usted es el <strong>Responsable</strong> del 
              tratamiento de los datos de sus pacientes. Amalitica actúa como <strong>Encargado</strong> a 
              su nombre.
            </p>
          </CardContent>
        </Card>

        {/* Section I: Identity */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              I. Identidad y Domicilio del Responsable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <strong>[Nombre de la Óptica]</strong> (en adelante, "la Óptica"), con domicilio 
              en <strong>[Dirección de la Óptica]</strong>, es el responsable del tratamiento 
              de sus datos personales en los términos de la Ley Federal de Protección de 
              Datos Personales en Posesión de los Particulares (LFPDPPP).
            </p>
          </CardContent>
        </Card>

        {/* Section II: Data Collected */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              II. Datos Personales que Recopilamos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Para brindarle nuestros servicios, recopilamos las siguientes categorías de 
              datos personales:
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">1. Datos de Identificación</h4>
                <p className="text-sm text-muted-foreground">
                  Nombre completo, fecha de nacimiento, género, número de teléfono, 
                  correo electrónico y domicilio completo.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">2. Datos de Salud (Sensibles)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  De conformidad con el Artículo 8 de la LFPDPPP, requerimos su consentimiento 
                  expreso y por escrito para tratar los siguientes datos sensibles:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-4">
                  <li>Historial de consultas optométricas y evaluaciones visuales</li>
                  <li>Prescripción oftalmológica (graduación: esfera, cilindro, eje, adición)</li>
                  <li>Agudeza visual</li>
                  <li>Mediciones biométricas (distancia pupilar, altura de segmento)</li>
                  <li>Condiciones médicas preexistentes que usted nos informe (ej. diabetes, hipertensión)</li>
                  <li>Síntomas, notas clínicas y cualquier otra información relacionada con su salud visual</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">3. Datos de Geolocalización</h4>
                <p className="text-sm text-muted-foreground">
                  Coordenadas geográficas (latitud y longitud) de su domicilio, obtenidas a 
                  partir de la dirección que usted nos proporciona, con el fin de realizar 
                  análisis estadísticos de distribución geográfica.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">4. Datos Fiscales</h4>
                <p className="text-sm text-muted-foreground">
                  Clave del Registro Federal de Contribuyentes (RFC), nombre o razón social, 
                  domicilio fiscal y régimen fiscal (solo en caso de requerir factura).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section III: Purposes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              III. Finalidades del Tratamiento de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm">
              Sus datos personales serán tratados para las siguientes finalidades, las cuales 
              hemos dividido en primarias (necesarias para el servicio) y secundarias (no esenciales).
            </p>

            {/* Primary Purposes */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">A. Finalidades Primarias</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Las siguientes finalidades son <strong>necesarias</strong> para la prestación 
                del servicio que usted solicita. Si usted no consiente el tratamiento de sus 
                datos para estas finalidades, nos veremos imposibilitados para atenderle.
              </p>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li><strong>Gestión Clínica:</strong> Registrar, administrar y dar seguimiento a su expediente clínico electrónico.</li>
                <li><strong>Prestación de Servicios:</strong> Realizar consultas optométricas, diagnósticos y evaluaciones de su salud visual.</li>
                <li><strong>Comercialización:</strong> Procesar la compra y entrega de productos ópticos (armazones, lentes, lentes de contacto).</li>
                <li><strong>Facturación y Cobranza:</strong> Emitir comprobantes fiscales, procesar pagos y gestionar la cobranza.</li>
                <li><strong>Comunicación:</strong> Contactarle para dar seguimiento a su tratamiento, confirmar citas o notificar sobre la entrega de productos.</li>
                <li><strong>Análisis Interno:</strong> Generar reportes estadísticos y analíticos para uso exclusivo de la Óptica, con el fin de evaluar y mejorar la calidad de nuestros servicios.</li>
                <li><strong>Cumplimiento Normativo:</strong> Cumplir con las obligaciones legales y requerimientos de autoridades competentes.</li>
              </ol>
            </div>

            {/* Secondary Purposes */}
            <div>
              <h4 className="font-semibold mb-3 text-primary">B. Finalidades Secundarias</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Las siguientes finalidades <strong>no son necesarias</strong> para la prestación 
                del servicio, pero nos permiten mejorar su experiencia y nuestros productos. 
                Usted puede oponerse a ellas en cualquier momento.
              </p>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li><strong>Análisis Científico y Estadístico:</strong> Utilizar sus datos de forma disociada y agregada para generar estudios de mercado, análisis de tendencias, predicción de demanda y entrenamiento de modelos de inteligencia artificial con fines de investigación científica y mejora de los servicios a nivel general.</li>
                <li><strong>Personalización de Servicios:</strong> Generar recomendaciones personalizadas de productos y servicios basadas en su historial de compras, consultas y preferencias, con el fin de mejorar su experiencia.</li>
                <li><strong>Marketing y Publicidad:</strong> Enviarle promociones, descuentos y publicidad sobre nuestros productos y servicios.</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Section IV: Options to Limit */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              IV. Opciones para Limitar el Uso o Divulgación de sus Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Usted tiene derecho a oponerse al tratamiento de sus datos para las 
              <strong> finalidades secundarias</strong>. Puede manifestar su negativa marcando 
              la casilla correspondiente en el formulario de consentimiento al momento de 
              proporcionar sus datos.
            </p>
            <p className="text-sm mt-3">
              Asimismo, puede revocar su consentimiento para estas finalidades en cualquier 
              momento posterior, ejerciendo sus derechos ARCO como se describe en la Sección VI.
            </p>
          </CardContent>
        </Card>

        {/* Section V: Data Transfers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              V. Transferencia de Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Para cumplir con las finalidades descritas, sus datos personales podrán ser 
              transferidos a los siguientes terceros:
            </p>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tercero Receptor</TableHead>
                  <TableHead>Finalidad de la Transferencia</TableHead>
                  <TableHead>¿Requiere Consentimiento?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Amalitica (Software de Gestión)</TableCell>
                  <TableCell>Proveer la plataforma tecnológica para la gestión de su expediente clínico y datos.</TableCell>
                  <TableCell><span className="text-green-600 font-medium">NO</span> (Encargado)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Laboratorios Ópticos</TableCell>
                  <TableCell>Fabricación y ensamble de sus lentes y productos ópticos.</TableCell>
                  <TableCell><span className="text-amber-600 font-medium">SÍ</span> (Incluido en consentimiento primario)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Servicio de Administración Tributaria (SAT)</TableCell>
                  <TableCell>Emisión de Comprobantes Fiscales Digitales por Internet (CFDI).</TableCell>
                  <TableCell><span className="text-green-600 font-medium">NO</span> (Obligación Legal)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Autoridades Competentes</TableCell>
                  <TableCell>Cumplimiento de requerimientos legales.</TableCell>
                  <TableCell><span className="text-green-600 font-medium">NO</span> (Obligación Legal)</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <p className="text-sm">
              No realizaremos transferencias de sus datos personales a terceros para finalidades 
              distintas a las mencionadas sin su consentimiento previo.
            </p>
          </CardContent>
        </Card>

        {/* Section VI: ARCO Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              VI. Medios para Ejercer los Derechos ARCO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Usted tiene derecho a <strong>Acceder, Rectificar, Cancelar u Oponerse</strong> al 
              tratamiento de sus datos personales (Derechos ARCO). Para ejercer sus derechos, 
              deberá presentar una solicitud por escrito en nuestro domicilio o enviarla al 
              correo electrónico <strong>[Email de Contacto de la Óptica]</strong>, la cual 
              deberá contener:
            </p>

            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Nombre completo del titular y domicilio u otro medio para comunicarle la respuesta.</li>
              <li>Documento que acredite su identidad (INE, pasaporte).</li>
              <li>Descripción clara y precisa de los datos personales respecto de los que busca ejercer alguno de los derechos ARCO.</li>
              <li>Cualquier otro elemento que facilite la localización de los datos.</li>
            </ol>

            <p className="text-sm">
              Le comunicaremos la determinación adoptada en un plazo máximo de 20 días hábiles.
            </p>
          </CardContent>
        </Card>

        {/* Section VII: Security Measures */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              VII. Medidas de Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Nos comprometemos a proteger sus datos personales mediante la implementación de 
              medidas de seguridad administrativas, técnicas y físicas. Los datos de salud y 
              coordenadas geográficas se almacenan de forma <strong>encriptada</strong>. El acceso 
              a su información está limitado al personal autorizado y se registra en bitácoras 
              de auditoría para garantizar su confidencialidad.
            </p>
          </CardContent>
        </Card>

        {/* Section VIII: Changes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              VIII. Cambios al Aviso de Privacidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones 
              derivadas de nuevos requerimientos legales o de nuestras propias necesidades. Nos 
              comprometemos a mantenerlo informado sobre los cambios que pueda sufrir, a través 
              de nuestro sitio web o mediante comunicación directa a su correo electrónico.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground mt-8 pb-8">
          <p>
            Este documento fue generado de acuerdo con los requisitos de la 
            Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
          </p>
          <p className="mt-2">
            Versión {PRIVACY_POLICY_VERSION} | Última actualización: {LAST_UPDATE_DATE}
          </p>
        </div>
      </main>
    </div>
  );
}

export default PrivacyNotice;
