import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();

  const { data: noticias } = await supabase
    .from("noticias")
    .select("id, titulo, slug, resumo, publicado_em")
    .eq("publicado", true)
    .order("publicado_em", { ascending: false })
    .limit(3);

  return (
    <div>
      <div className="hero">
        <h1>Física</h1>
        <p>
          Material de apoio às aulas de Física das turmas de 1º, 2º e 3º anos do Ensino Médio da
          Escola Estadual Carmo Giffoni.
        </p>
      </div>

      <div className="container" style={{ padding: "48px 24px" }}>
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>Conteúdo por ano</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
          {[1, 2, 3].map((ano) => (
            <Link
              key={ano}
              href={`/ano/${ano}`}
              className="card"
              style={{ padding: 24, textDecoration: "none", color: "var(--ink)" }}
            >
              <div style={{ fontFamily: "var(--display)", fontSize: 28, fontWeight: 700, color: "var(--primary)" }}>
                {ano}º Ano
              </div>
              <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6 }}>
                Ver tópicos e materiais
              </div>
            </Link>
          ))}
        </div>

        {(noticias ?? []).length > 0 && (
          <>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Últimas notícias</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(noticias ?? []).map((n) => (
                <Link
                  key={n.id}
                  href={`/noticias/${n.slug}`}
                  className="card"
                  style={{ padding: "16px 20px", textDecoration: "none", color: "var(--ink)" }}
                >
                  <div style={{ fontWeight: 600 }}>{n.titulo}</div>
                  {n.resumo && <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 4 }}>{n.resumo}</div>}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
