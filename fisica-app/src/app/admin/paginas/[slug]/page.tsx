import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPaginaPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sucesso?: string };
}) {
  const supabase = createClient();
  const { data: pagina } = await supabase.from("paginas").select("titulo, corpo_html").eq("slug", params.slug).single();

  async function salvar(formData: FormData) {
    "use server";
    const supabase = createClient();
    const corpo_html = formData.get("corpo_html") as string;
    await supabase
      .from("paginas")
      .update({ corpo_html, atualizado_em: new Date().toISOString() })
      .eq("slug", params.slug);
    redirect(`/admin/paginas/${params.slug}?sucesso=1`);
  }

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: 720 }}>
      <a href="/admin" style={{ fontSize: 13.5 }}>
        &larr; Voltar ao painel
      </a>
      <h1 style={{ fontSize: 24, margin: "10px 0 4px" }}>Editar: {pagina?.titulo ?? params.slug}</h1>
      <p style={{ color: "var(--ink-soft)", fontSize: 13, marginTop: 0, marginBottom: 20 }}>
        Aceita HTML simples (parágrafos, links, imagens, negrito). Se preferir, escreva só o texto puro — também
        funciona.
      </p>

      {searchParams.sucesso && (
        <div style={{ background: "#e6f3f1", color: "#1f6d63", padding: "10px 14px", borderRadius: 4, marginBottom: 16, fontSize: 13.5 }}>
          Salvo com sucesso.
        </div>
      )}

      <form action={salvar} className="card" style={{ padding: 20 }}>
        <div className="field">
          <label htmlFor="corpo_html">Conteúdo</label>
          <textarea id="corpo_html" name="corpo_html" rows={16} defaultValue={pagina?.corpo_html ?? ""} />
        </div>
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </form>
    </div>
  );
}
