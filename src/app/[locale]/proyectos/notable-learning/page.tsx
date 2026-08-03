import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Evidence } from "@/components/Evidence";

export const metadata: Metadata = {
  title: "Notable Learning — caso de estudio",
  description:
    "LMS K-12 para 500+ escuelas: un editor de contenido diseñado por sus modos de fallo y un bug de PDF de cuatro capas que terminó en un proxy de streaming.",
};

const h2 = "display-md text-[clamp(21px,3vw,25px)] font-semibold";
const body = "text-[16px] leading-[1.75] text-muted max-w-[65ch]";
const sectionGap = "mt-14 sm:mt-16";

function FootnoteRef({ n }: { n: number }) {
  return (
    <a
      href={`#nota-${n}`}
      id={`ref-${n}`}
      aria-label={`Nota ${n}`}
      className="ml-0.5 align-super font-mono text-[11px] text-copper no-underline"
    >
      {n}
    </a>
  );
}

const principles = [
  {
    title: "La percepción de guardado importa tanto como el guardado",
    text: "Un docente que pierde veinte minutos de trabajo por una recarga accidental o una caída de conexión no vuelve a confiar en el producto. El estado de guardado tenía que ser visible y honesto: una señal discreta pero siempre presente confirma cuándo los cambios están a salvo, y los toasts explican qué pasó cuando algo falla — los errores inesperados como parte del diseño, no como parche posterior.",
  },
  {
    title: "La subida temprana de archivos crea huérfanos",
    text: "Si cada imagen se sube al bucket en el momento en que el docente la inserta, cada borrador abandonado deja objetos ocupando almacenamiento para siempre. Hacía falta una estrategia explícita de confirmación y limpieza.",
  },
  {
    title: "Un archivo subido es input no confiable",
    text: "Aunque venga de un usuario autenticado. La validación tenía que ocurrir en el servidor y sobre el contenido real del archivo, no sobre lo que el cliente dice que es.",
  },
];

const layers = [
  {
    label: "capa 1",
    title: "Metadata del objeto",
    text: "Cuando un servidor entrega un archivo, el header Content-Disposition le dice al navegador qué hacer con él: inline significa \u201cmuéstralo en la página\u201d y attachment, \u201cdescárgalo\u201d. GCS conservaba el attachment grabado al momento de subir el archivo, así que el navegador descargaba el PDF o navegaba hacia él en vez de mostrarlo dentro de la lección. Se corrigió forzando inline al generar la URL firmada, con saneamiento del nombre de archivo para que un filename malicioso no pudiera inyectar contenido en el header.",
  },
  {
    label: "capa 2",
    title: "CSP",
    text: "La Content Security Policy es una lista blanca que declara con qué dominios puede comunicarse la aplicación; lo que no está en la lista, el navegador lo bloquea. El detalle poco conocido: cuando una petición es redirigida, el navegador vuelve a evaluar esa lista contra el destino final del redirect, no solo contra la URL original. Nuestra ruta redirigía hacia el dominio de Google Cloud Storage, que no estaba en la lista. Fue un arreglo real y necesario — que solo movió el fallo un escalón: de bloqueado por CSP a bloqueado por CORS.",
  },
  {
    label: "capa 3",
    title: "Una hipótesis mía que empeoró las cosas",
    text: "En un intento anterior había activado withCredentials en el visor — una opción que le dice al navegador \u201cincluye las cookies en esta petición\u201d — con la teoría de que el visor llegaba sin la cookie de sesión. La teoría era falsa, y la opción tenía un costo oculto: cuando una petición viaja con cookies, el navegador exige que cada servidor de la cadena responda con un permiso explícito para peticiones con credenciales, incluido GCS, que nunca lo emite. Mi arreglo introdujo un bloqueo nuevo mientras intentaba resolver el original. Tuve que deshacer mi propio cambio y verificarlo en vivo contra una URL firmada real, viendo la negociación completa pasar en verde. Parecía resuelto. No lo estaba.",
  },
  {
    label: "capa 4",
    title: "La causa raíz",
    text: "CORS es el mecanismo con el que el navegador decide si una página puede leer datos de otro dominio; cada petición lleva un header Origin que identifica quién la hace. La trampa: react-pdf descarga el documento con un fetch sujeto a CORS, y cuando ese fetch es redirigido hacia otro dominio, la especificación obliga al navegador a reemplazar el Origin por la palabra \u201cnull\u201d — una marca deliberada de \u201ceste origen ya no es confiable tras el redirect\u201d. Y ningún servidor puede dar permiso a \u201cnull\u201d de forma segura, porque ese mismo valor lo usan las páginas abiertas desde archivos locales y los iframes aislados. La petición contra la URL firmada moría siempre, sin importar cuán correcta fuera la configuración del bucket. Por eso imágenes y videos nunca fallaron: img y video descargan su contenido en un modo relajado (no-cors) al que esa regla no aplica.",
  },
];

export default async function NotableLearningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <header className="mx-auto flex max-w-[720px] flex-wrap items-baseline justify-between gap-x-5 gap-y-2 px-5 pt-6 sm:px-9">
        <Link href="/" className="font-mono text-[13px] font-medium no-underline transition-colors hover:text-copper">
          <span aria-hidden="true" className="text-copper">←</span> georgepuma.dev
        </Link>
        <p className="font-mono text-[12.5px] text-muted">
          <span aria-hidden="true" className="text-copper">/</span>proyectos
          <span aria-hidden="true" className="text-copper">/</span>notable-learning
        </p>
      </header>

      <main id="contenido">
        <article className="mx-auto max-w-[720px] px-5 pb-16 pt-16 sm:px-9 sm:pt-24">
          <header>
            <p className="mb-4 font-mono text-[12px] text-muted">
              Caso de estudio · Principal contribuidor · Feb – Jun 2026
            </p>
            <h1 className="display text-balance text-[clamp(34px,6.4vw,58px)] font-bold leading-[1.05]">
              Notable Learning<span aria-hidden="true" className="text-copper">.</span>
            </h1>
            <p className="mt-5 max-w-[60ch] text-[clamp(16.5px,2.2vw,18px)] leading-[1.7] text-muted">
              LMS institucional K-12 para 500+ escuelas en EE.UU. y 10 países, construido
              por Junto AI. Frontend completo y capa de API: editor de contenido, video,
              RBAC de 5 roles
              <FootnoteRef n={1} /> y cumplimiento FERPA
              <FootnoteRef n={2} /> sobre un esquema de 29 entidades.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Evidence value="380+ commits" source="100+ tickets" />
              <Evidence value="entregado en fecha" source="12 jun 2026" />
              <Evidence value="WCAG 2.1 AA" source="jest-axe" />
            </div>
            <p className="mt-6 font-mono text-[12.5px] leading-[1.8] text-muted">
              TypeScript · React 19 · Next.js 16 · Prisma · PostgreSQL · GCS · Mux
            </p>
            <div className="mt-10 h-px bg-line sm:mt-12" />
          </header>

          <section className={sectionGap} aria-labelledby="contexto">
            <h2 id="contexto" className={h2}>Contexto y rol</h2>
            <div className={`mt-4 space-y-4 ${body}`}>
              <p>
                Fui el principal contribuidor por volumen de aportes de la Fase 1: 380+
                commits sobre 100+ tickets, con entregas semanales revisadas por el CTO y
                despliegue a producción con aprobación manual. Mi alcance contractual
                cubría la librería de componentes UI, el editor de contenido para
                docentes, los dashboards de estudiante y docente, el panel de
                administración multi-institución y las integraciones de video (Mux) y
                almacenamiento (Google Cloud Storage).
              </p>
              <p>
                Dos condiciones definieron todo el proyecto: los datos eran de
                estudiantes menores de edad — cumplimiento FERPA: aislamiento
                multi-tenant en cada query, cero PII en logs, auditoría de acciones — y
                la calidad era contractual, no aspiracional: WCAG 2.1 AA con tests
                automatizados de accesibilidad en cada componente, 80% de cobertura como
                objetivo y E2E con Playwright para los flujos críticos.
              </p>
            </div>
          </section>

          <section className={sectionGap} aria-labelledby="decision">
            <h2 id="decision" className={h2}>La decisión: diseñar el editor por sus modos de fallo</h2>
            <p className={`mt-4 ${body}`}>
              La pieza central del producto era el editor de cursos para docentes:
              bloques de texto enriquecido, video, PDF y archivos descargables,
              reordenables dentro de cada lección. Ya había construido editores antes —
              módulos de campañas y plantillas de correo en un sistema financiero — y
              sabía dónde se rompen: no en el caso feliz, sino en los bordes. Antes de
              escribir código, presenté al equipo los tres modos de fallo que había visto
              hundir editores, y cómo pensaba diseñar contra ellos.
            </p>
            <ol className="mt-6">
              {principles.map((p, i) => (
                <li key={p.title} className={`flex gap-4 border-t border-line py-5 ${i === principles.length - 1 ? "border-b" : ""}`}>
                  <span aria-hidden="true" className="pt-0.5 font-mono text-[12.5px] text-copper">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-[16.5px] font-semibold">{p.title}</h3>
                    <p className="mt-1.5 max-w-[58ch] text-[15px] leading-[1.65] text-muted">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className={`mt-6 ${body}`}>
              El equipo aprobó el enfoque y lo implementé. La versión final de la subida
              de archivos acabó siendo un flujo de tres pasos que resuelve los tres
              problemas a la vez: una ruta <em>initiate</em> que emite una URL firmada de
              subida con el tipo y el tamaño máximo fijados criptográficamente en la
              firma — los hace cumplir GCS, no el cliente —, el envío directo del
              navegador al bucket (los bytes nunca pasan por el servidor de la
              aplicación), y una ruta <em>finalize</em> que relee los primeros bytes del
              objeto para validar en servidor que el contenido es realmente un PDF, y
              que borra el objeto si la validación falla — cerrando la puerta de los
              huérfanos y la del contenido falsificado en el mismo movimiento.
            </p>
          </section>

          <section className={sectionGap} aria-labelledby="guerra">
            <h2 id="guerra" className={h2}>La guerra: el PDF que no renderizaba</h2>
            <p className={`mt-4 ${body}`}>
              El bug que más me costó del proyecto parecía trivial: los PDFs subidos por
              docentes no se mostraban en el visor. Pantalla en blanco. Lo desconcertante
              era que las imágenes y los videos, servidos por la misma arquitectura —
              bucket privado, ruta autorizada, redirect a una URL firmada — funcionaban
              perfectamente. El diagnóstico terminó siendo una cadena de cuatro capas
              apiladas, donde cada arreglo destapaba la siguiente.
            </p>
            <ul className="mt-6">
              {layers.map((l, i) => (
                <li key={l.label} className={`border-t border-line py-5 ${i === layers.length - 1 ? "border-b" : ""}`}>
                  <p className="font-mono text-[12px] text-copper">{l.label}</p>
                  <h3 className="mt-1.5 text-[16.5px] font-semibold">{l.title}</h3>
                  <p className="mt-1.5 max-w-[58ch] text-[15px] leading-[1.65] text-muted">{l.text}</p>
                </li>
              ))}
            </ul>
            <div className={`mt-6 space-y-4 ${body}`}>
              <p>
                La conclusión de la capa 4 fue que el problema no se podía arreglar
                &ldquo;ajustando la petición&rdquo;: había que eliminar el cruce de
                orígenes. Reescribí la ruta de PDFs de redirect a proxy de streaming: el
                servidor obtiene la URL firmada, hace el fetch él mismo y transmite el
                contenido al cliente, reenviando los headers de rango y condicionales
                hacia arriba y propagando los de caché hacia abajo
                <FootnoteRef n={3} />, con <em>Content-Disposition</em> sobrescrito a{" "}
                <em>inline</em>. El navegador nunca sale del origen de la aplicación;
                CORS desaparece de la ecuación.
              </p>
              <p>
                Quedaba un problema hermano: la subida también estaba rota para archivos
                grandes, porque el límite de 4.5 MB del body de las funciones de Vercel
                es innegociable y hacía inalcanzable el límite anunciado de 50 MB. La
                solución fue el flujo direct-to-GCS de tres pasos descrito arriba — el
                mismo patrón que después se replicó para los bloques de archivos
                adjuntos.
              </p>
              <p>
                Dos detalles hicieron este bug más difícil de lo normal. Primero, yo no
                tenía acceso a la configuración del bucket: los cambios de CORS los
                aplicaban los dueños de la infraestructura. Mi trabajo fue diagnosticar
                sin poder tocar, y entregarles instrucciones exactas — qué cambiar, en
                qué entorno y por qué — documentadas en el propio PR junto al comando
                reproducible. Segundo, usé Claude como herramienta de investigación para
                explorar las especificaciones de Fetch y CORS y contrastar hipótesis; la
                dirección de la investigación, las verificaciones en vivo y los
                descartes fueron míos — como demuestra el hecho de que una de mis
                hipótesis fue lo bastante convincente para llegar a producción y tener
                que ser revertida.
              </p>
            </div>
          </section>

          <section className={sectionGap} aria-labelledby="guards">
            <h2 id="guards" className={h2}>Guards contra regresión</h2>
            <p className={`mt-4 ${body}`}>
              Quedó un test que afirma explícitamente la <em>ausencia</em> de{" "}
              <em>withCredentials</em> — el guard más directo contra repetir el intento
              fallido —, una suite de 13 tests sobre la ruta proxy (rangos,
              condicionales, respuestas 304 sin headers sobrescritos), la validación del
              contenido real del archivo en servidor, y los límites de subida hechos
              cumplir por la firma criptográfica en vez de por el cliente.
            </p>
            <blockquote className="mt-10 max-w-[56ch]">
              <span aria-hidden="true" className="mb-5 block h-0.5 w-9 bg-copper" />
              <p className="text-[clamp(19px,2.6vw,22px)] font-medium leading-[1.55] tracking-[-0.005em]">
                Cada intento fallido descartó una hipótesis plausible. El diagnóstico
                correcto no era visible hasta que las capas superiores se despejaron.
              </p>
            </blockquote>
          </section>

          <section className={sectionGap} aria-labelledby="mejor">
            <h2 id="mejor" className={h2}>Lo que dejaría mejor</h2>
            <p className={`mt-4 ${body}`}>
              La configuración CORS del bucket vive fuera del repositorio y se aplica a
              mano por entorno. Un despliegue a un entorno nuevo con el bucket sin
              configurar rompe la subida sin que ningún test lo detecte. Hoy lo
              resolvería con la configuración como código desde el día uno.
            </p>
          </section>

          <section className={sectionGap} aria-labelledby="cierre">
            <h2 id="cierre" className={h2}>Cierre</h2>
            <p className={`mt-4 mb-7 ${body}`}>
              El proyecto se entregó en fecha — 12 de junio — y el contrato concluyó con
              la entrega. De este proyecto también salió el revisor automatizado de PRs
              que construí sobre Claude Code:{" "}
              <Link href="/#ia" className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-copper hover:decoration-copper">
                la otra mitad de esta historia
              </Link>
              .
            </p>
            <Link
              href="/#proyectos"
              className="font-mono text-[13.5px] font-medium underline decoration-line underline-offset-[5px] transition-colors hover:text-copper hover:decoration-copper"
            >
              <span aria-hidden="true" className="text-copper">←</span> Ver todos los proyectos
            </Link>
          </section>

          <footer className="mt-14 border-t border-line pt-6 sm:mt-16">
            <p className="mb-3 font-mono text-[11.5px] tracking-[0.04em] text-muted">notas</p>
            <ol className="space-y-2.5">
              {[
                "RBAC — control de acceso basado en roles: cinco roles con permisos definidos por enums, no por strings libres.",
                "FERPA — Family Educational Rights and Privacy Act: la ley estadounidense que regula los datos educativos de menores.",
                "Range permite pedir solo un fragmento del archivo (el visor carga un PDF grande página a página); ETag es una huella de la versión y If-None-Match la forma de decir \u201cenvíamelo solo si cambió\u201d; Content-Range indica qué fragmento se devuelve y Last-Modified apoya el caché. Un proxy que no los propaga rompe silenciosamente la carga parcial y el caché: funcionaría, pero lento.",
              ].map((nota, i) => (
                <li key={nota} id={`nota-${i + 1}`} className="flex max-w-[62ch] gap-3 text-[13.5px] leading-[1.6] text-muted">
                  <a href={`#ref-${i + 1}`} aria-label={`Volver a la referencia ${i + 1}`} className="font-mono text-[12px] text-copper no-underline">
                    {i + 1}
                  </a>
                  <span>{nota}</span>
                </li>
              ))}
            </ol>
          </footer>
        </article>
      </main>
    </>
  );
}
