import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import AnexarArquivo from "@/app/components/AnexarArquivo";

async function atualizarNoticia(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = formData.get("id") as string;
  const titulo = formData.get("titulo") as string;
  const resumo = formData.get("resumo") as string;
  const capa_url = (formData.get("capa_url") as string) || null;
  const corpo_html = formData.get("corpo_html") as string;
  const publicado = formData.get("publicado") === "on";

  await supabase.from("noticias").update({ titulo, resumo, capa_url, corpo_html, publicado }).eq("id", id);
  redirect(`/admin/noticias/${id}?sucesso=1`);
}

export default async function AdminNoticiaPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { sucesso?: string };
}) {
  const supabase = createClient();
  const { data: noticia } = await supabase
    .from("noticias")
    .select("id, titulo, slug, resumo, capa_url, corpo_html, publicado")
    .eq("id", params.id)
    .single();

  if (!noticia) notFound();

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: 720 }}>
      <a href="/admin/noticias" style={{ fontSize: 13.5 }}>
        &larr; Voltar à lista
      </a>
      <h1 style={{ fontSize: 24, margin: "10px 0 4px" }}>Editar notícia</h1>

      {searchParams.sucesso && (
        <div style={{ background: "#e6f3f1", color: "#1f6d63", padding: "10px 14px", borderRadius: 4, margin: "12px 0", fontSize: 13.5 }}>
          Salvo com sucesso.
        </div>
      )}

      <form action={atualizarNoticia} className="card" style={{ padding: 20, marginTop: 16 }}>
        <input type="hidden" name="id" value={noticia.id} />
        <div className="field">
          <label htmlFor="titulo">Título</label>
          <input id="titulo" name="titulo" type="text" defaultValue={noticia.titulo} required />
        </div>
        <div className="field">
          <label htmlFor="resumo">Resumo (aparece na lista)</label>
          <input id="resumo" name="resumo" type="text" defaultValue={noticia.resumo ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="capa_url">Imagem de capa (opcional)</label>
          <input id="capa_url" name="capa_url" type="text" defaultValue={noticia.capa_url ?? ""} />
          <AnexarArquivo targetId="capa_url" modo="url" />
        </div>
        <div className="field">
          <label htmlFor="corpo_html">Conteúdo</label>
          <textarea id="corpo_html" name="corpo_html" rows={12} defaultValue={noticia.corpo_html} />
          <AnexarArquivo targetId="corpo_html" modo="html" />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, marginBottom: 16 }}>
          <input type="checkbox" name="publicado" defaultChecked={noticia.publicado} style={{ width: "auto" }} />
          Publicado (visível no site)
        </label>
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </form>
    </div>
  );
}
