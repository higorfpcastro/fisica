import Link from "next/link";
import { buscarTopicos } from "@/lib/topicos";

export default async function AnoPage({ params }: { params: { ano: string } }) {
  const ano = parseInt(params.ano, 10);
  const topicos = await buscarTopicos("conteudo", ano);

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map((a) => (
          <Link key={a} href={`/ano/${a}`} className={a === ano ? "btn btn-primary" : "btn btn-secondary"}>
            {a}º Ano
          </Link>
        ))}
      </div>

      <h1 style={{ fontSize: 26, marginBottom: 20 }}>{ano}º Ano — Conteúdo</h1>

      {topicos.length === 0 && <p style={{ color: "var(--ink-soft)" }}>Nenhum tópico publicado ainda.</p>}

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
