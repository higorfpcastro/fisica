import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RenderMaterial from "@/app/components/RenderMaterial";
import { notFound } from "next/navigation";

export default async function TopicoPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();

  const { data: topico } = await supabase
    .from("topicos")
    .select("id, titulo, categoria, ano, parent_id")
    .eq("slug", params.slug)
    .single();

  if (!topico) notFound();

  const { data: subtopicos } = await supabase
    .from("topicos")
    .select("id, titulo, slug")
    .eq("parent_id", topico.id)
    .eq("publicado", true)
    .order("ordem");

  const { data: materiais } = await supabase
    .from("materiais")
    .select("id, tipo, titulo, conteudo")
    .eq("topico_id", topico.id)
    .order("ordem");

  let paiTitulo: string | null = null;
  let paiSlug: string | null = null;
  if (topico.parent_id) {
    const { data: pai } = await supabase.from("topicos").select("titulo, slug").eq("id", topico.parent_id).single();
    if (pai) {
      paiTitulo = pai.titulo;
      paiSlug = pai.slug;
    }
  }

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      {paiTitulo && paiSlug && (
        <Link href={`/topico/${paiSlug}`} style={{ fontSize: 13.5 }}>
          &larr; {paiTitulo}
        </Link>
      )}
      <h1 style={{ fontSize: 26, margin: "10px 0 24px" }}>{topico.titulo}</h1>

      {(subtopicos ?? []).length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {(subtopicos ?? []).map((s) => (
            <Link
              key={s.id}
              href={`/topico/${s.slug}`}
              className="card"
              style={{ padding: "14px 18px", textDecoration: "none", color: "var(--ink)", fontWeight: 600 }}
            >
              {s.titulo}
            </Link>
          ))}
        </div>
      )}

      {(materiais ?? []).length === 0 && (subtopicos ?? []).length === 0 && (
        <p style={{ color: "var(--ink-soft)" }}>Nenhum material publicado ainda neste tópico.</p>
      )}

      {(materiais ?? []).map((m: any) => (
        <RenderMaterial key={m.id} material={m} />
      ))}
    </div>
  );
}
