import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NoticiasPage() {
  const supabase = createClient();
  const { data: noticias } = await supabase
    .from("noticias")
    .select("id, titulo, slug, resumo, publicado_em")
    .eq("publicado", true)
    .order("publicado_em", { ascending: false });

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Notícias</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {(noticias ?? []).map((n) => (
          <Link
            key={n.id}
            href={`/noticias/${n.slug}`}
            className="card"
            style={{ padding: "18px 20px", textDecoration: "none", color: "var(--ink)" }}
          >
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>
              {new Date(n.publicado_em).toLocaleDateString("pt-BR")}
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, marginTop: 4 }}>{n.titulo}</div>
            {n.resumo && <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 4 }}>{n.resumo}</div>}
          </Link>
        ))}
        {(noticias ?? []).length === 0 && <p style={{ color: "var(--ink-soft)" }}>Nenhuma notícia publicada ainda.</p>}
      </div>
    </div>
  );
}
