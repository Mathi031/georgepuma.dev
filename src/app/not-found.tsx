import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="es">
      <body>
        <main
          style={{
            fontFamily: "system-ui",
            padding: "4rem 1.5rem",
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          <h1>404</h1>
          <p>
            Esta página no existe. <Link href="/">Volver al inicio</Link>.
          </p>
        </main>
      </body>
    </html>
  );
}
