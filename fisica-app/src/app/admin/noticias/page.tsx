import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { gerarSlug } from "@/lib/slug";
import ConfirmButton from "@/app/components/ConfirmButton";
import { redirect } from "next/navigation";

async function criarNoticia(formData: FormData) {
  "use server";
  const supabase = createClient();
  const titulo = formData.get("titulo") as string;
  const slug = gerarSlug(titulo) + "-" + Math.random().toString(36).slice(2, 7);
  const { data } = await supabase
    .from("noticias")
    .insert({ titulo, slug, corpo_html: "<p>Em breve.</p>" })
    .select("id")
    .single();
  redirect(`/admin/noticias/${data!.id}`);
}

async function excluirNoticia(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = formData.get("id") as string;
  await supabase.from("noticias").delete().eq("id", id);
  redirect("/admin/noticias");
}

async function alternarPublicado(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = formData.get("id") as string;
  const publicado = formData.get("publicado") === "true";
  await supabase.from("noticias").update({ publicado: !publicado }).eq("id", id);
  redirect("/admin/noticias");
}

export default async function AdminNoticiasPage() {
  const supabase = createClient();
  const { data: noticias } = await supabase
    .from("noticias")
    .select("id, titulo, publicado, publicado_em")
    .order("publicado_em", { ascending: false });

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <a href="/admin" style={{ fontSize: 13.5 }}>
        &larr; Voltar ao painel
      </a>
      <h1 style={{ fontSize: 24, margin: "10px 0 20px" }}>Notícias</h1>

      <form action={criarNoticia} className="card" style={{ padding: 20, marginBottom: 24, display: "flex", gap: 10, alignItems: "end" }}>
        <div className="field" style={{ marginBottom: 0, flex: 1 }}>
          <label htmlFor="titulo">Nova notícia</label>
          <input id="titulo" name="titulo" type="text" required placeholder="Título da notícia" />
        </div>
        <button type="submit" className="btn btn-primary">
          Criar
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Data</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(noticias ?? []).map((n) => (
            <tr key={n.id}>
              <td>
                <Link href={`/admin/noticias/${n.id}`}>{n.titulo}</Link>
              </td>
              <td>{new Date(n.publicado_em).toLocaleDateString("pt-BR")}</td>
              <td>
                <form>
                  <input type="hidden" name="id" value={n.id} />
                  <input type="hidden" name="publicado" value={String(n.publicado)} />
                  <button formAction={alternarPublicado} type="submit" className="tag" style={{ border: "none", cursor: "pointer" }}>
                    {n.publicado ? "Publicado" : "Rascunho"}
                  </button>
                </form>
              </td>
              <td>
                <form>
                  <input type="hidden" name="id" value={n.id} />
                  <ConfirmButton formAction={excluirNoticia} confirmText={`Excluir a notícia "${n.titulo}"?`} className="btn-text">
                    Excluir
                  </ConfirmButton>
                </form>
              </td>
            </tr>
          ))}
          {(noticias ?? []).length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 24 }}>
                Nenhuma notícia ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
