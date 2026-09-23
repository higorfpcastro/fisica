import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { gerarSlug } from "@/lib/slug";
import ConfirmButton from "@/app/components/ConfirmButton";
import { CATEGORIA_LABEL } from "@/lib/topicos";
import { redirect } from "next/navigation";

const CATEGORIAS = ["conteudo", "atividades", "simulacoes", "tabelas", "tecnologia"];

async function criarTopico(formData: FormData) {
  "use server";
  const supabase = createClient();
  const titulo = formData.get("titulo") as string;
  const categoria = formData.get("categoria") as string;
  const ano = parseInt(formData.get("ano") as string, 10);
  const slug = gerarSlug(titulo) + "-" + Math.random().toString(36).slice(2, 7);

  await supabase.from("topicos").insert({ titulo, categoria, ano, slug, parent_id: null });
  redirect(`/admin/topicos?categoria=${categoria}&ano=${ano}`);
}

async function excluirTopico(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = formData.get("id") as string;
  const categoria = formData.get("categoria") as string;
  const ano = formData.get("ano") as string;
  await supabase.from("topicos").delete().eq("id", id);
  redirect(`/admin/topicos?categoria=${categoria}&ano=${ano}`);
}

async function alternarPublicado(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = formData.get("id") as string;
  const publicado = formData.get("publicado") === "true";
  const categoria = formData.get("categoria") as string;
  const ano = formData.get("ano") as string;
  await supabase.from("topicos").update({ publicado: !publicado }).eq("id", id);
  redirect(`/admin/topicos?categoria=${categoria}&ano=${ano}`);
}

export default async function AdminTopicosPage({
  searchParams,
}: {
  searchParams: { categoria?: string; ano?: string };
}) {
  const categoria = searchParams.categoria ?? "conteudo";
  const ano = parseInt(searchParams.ano ?? "1", 10);

  const supabase = createClient();
  const { data: topicos } = await supabase
    .from("topicos")
    .select("id, titulo, slug, ordem, publicado")
    .eq("categoria", categoria)
    .eq("ano", ano)
    .is("parent_id", null)
    .order("ordem");

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <a href="/admin" style={{ fontSize: 13.5 }}>
        &larr; Voltar ao painel
      </a>
      <h1 style={{ fontSize: 24, margin: "10px 0 20px" }}>{CATEGORIA_LABEL[categoria]}</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        {CATEGORIAS.map((c) => (
          <Link
            key={c}
            href={`/admin/topicos?categoria=${c}&ano=${ano}`}
            className={c === categoria ? "btn btn-primary" : "btn btn-secondary"}
          >
            {CATEGORIA_LABEL[c]}
          </Link>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map((a) => (
          <Link
            key={a}
            href={`/admin/topicos?categoria=${categoria}&ano=${a}`}
            className={a === ano ? "btn btn-primary" : "btn btn-secondary"}
          >
            {a}º Ano
          </Link>
        ))}
      </div>

      <form action={criarTopico} className="card" style={{ padding: 20, marginBottom: 24, display: "flex", gap: 10, alignItems: "end" }}>
        <input type="hidden" name="categoria" value={categoria} />
        <input type="hidden" name="ano" value={ano} />
        <div className="field" style={{ marginBottom: 0, flex: 1 }}>
          <label htmlFor="titulo">Novo tópico</label>
          <input id="titulo" name="titulo" type="text" required placeholder="Ex.: Cinemática" />
        </div>
        <button type="submit" className="btn btn-primary">
          Adicionar
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(topicos ?? []).map((t) => (
            <tr key={t.id}>
              <td>
                <Link href={`/admin/topicos/${t.id}`}>{t.titulo}</Link>
              </td>
              <td>
                <form>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="publicado" value={String(t.publicado)} />
                  <input type="hidden" name="categoria" value={categoria} />
                  <input type="hidden" name="ano" value={ano} />
                  <button formAction={alternarPublicado} type="submit" className="tag" style={{ border: "none", cursor: "pointer" }}>
                    {t.publicado ? "Publicado" : "Rascunho"}
                  </button>
                </form>
              </td>
              <td>
                <form>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="categoria" value={categoria} />
                  <input type="hidden" name="ano" value={ano} />
                  <ConfirmButton
                    formAction={excluirTopico}
                    confirmText={`Excluir "${t.titulo}" e todos os materiais/subtópicos dentro dele? Não pode ser desfeito.`}
                    className="btn-text"
                  >
                    Excluir
                  </ConfirmButton>
                </form>
              </td>
            </tr>
          ))}
          {(topicos ?? []).length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 24 }}>
                Nenhum tópico ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
