import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: noticia } = await supabase
    .from("noticias")
    .select("titulo, corpo_html, capa_url, publicado_em")
    .eq("slug", params.slug)
    .single();

  if (!noticia) notFound();

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 6 }}>
        {new Date(noticia.publicado_em).toLocaleDateString("pt-BR")}
      </div>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>{noticia.titulo}</h1>
      {noticia.capa_url && (
        <img src={noticia.capa_url} alt="" style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 20 }} />
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: noticia.corpo_html }} />
    </div>
  );
}
