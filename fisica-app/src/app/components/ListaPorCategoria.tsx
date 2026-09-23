import Link from "next/link";
import { buscarTopicos, CATEGORIA_LABEL } from "@/lib/topicos";

export default async function ListaPorCategoria({
  categoria,
  basePath,
  ano,
}: {
  categoria: string;
  basePath: string;
  ano: number;
}) {
  const topicos = await buscarTopicos(categoria, ano);

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map((a) => (
          <Link key={a} href={`${basePath}/${a}`} className={a === ano ? "btn btn-primary" : "btn btn-secondary"}>
            {a}º Ano
          </Link>
        ))}
      </div>

      <h1 style={{ fontSize: 26, marginBottom: 20 }}>
        {ano}º Ano — {CATEGORIA_LABEL[categoria]}
      </h1>

      {topicos.length === 0 && <p style={{ color: "var(--ink-soft)" }}>Nenhum item publicado ainda.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {topicos.map((t) => (
          <Link
            key={t.id}
            href={`/topico/${t.slug}`}
            className="card"
            style={{ padding: "16px 20px", textDecoration: "none", color: "var(--ink)", fontWeight: 600 }}
          >
            {t.titulo}
          </Link>
        ))}
      </div>
    </div>
  );
}
