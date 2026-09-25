import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { gerarSlug } from "@/lib/slug";
import ConfirmButton from "@/app/components/ConfirmButton";
import { redirect, notFound } from "next/navigation";

async function atualizarTopico(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = formData.get("id") as string;
  const titulo = formData.get("titulo") as string;
  const ordem = parseInt((formData.get("ordem") as string) || "0", 10);
  const publicado = formData.get("publicado") === "on";
  await supabase.from("topicos").update({ titulo, ordem, publicado }).eq("id", id);
  redirect(`/admin/topicos/${id}?sucesso=1`);
}

async function excluirTopico(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = formData.get("id") as string;
  const categoria = formData.get("categoria") as string;
  const ano = formData.get("ano") as string;
  const parent_id = formData.get("parent_id") as string;
  await supabase.from("topicos").delete().eq("id", id);
  if (parent_id) {
    redirect(`/admin/topicos/${parent_id}`);
  }
  redirect(`/admin/topicos?categoria=${categoria}&ano=${ano}`);
}

async function criarSubtopico(formData: FormData) {
  "use server";
  const supabase = createClient();
  const parent_id = formData.get("parent_id") as string;
  const categoria = formData.get("categoria") as string;
  const ano = parseInt(formData.get("ano") as string, 10);
  const titulo = formData.get("titulo") as string;
  const slug = gerarSlug(titulo) + "-" + Math.random().toString(36).slice(2, 7);
  await supabase.from("topicos").insert({ titulo, categoria, ano, slug, parent_id });
  redirect(`/admin/topicos/${parent_id}`);
}

async function criarMaterial(formData: FormData) {
  "use server";
  const supabase = createClient();
  const topico_id = formData.get("topico_id") as string;
  const tipo = formData.get("tipo") as string;
  const titulo = (formData.get("titulo") as string) || null;
  let conteudo = ((formData.get("conteudo") as string) || "").trim();

  const arquivo = formData.get("arquivo") as File | null;
  if (arquivo && arquivo.size > 0) {
    const extensao = arquivo.name.split(".").pop() || "arquivo";
    const caminho = `${topico_id}/${Date.now()}.${extensao}`;
    const { error: erroUpload } = await supabase.storage
      .from("materiais")
      .upload(caminho, arquivo, { contentType: arquivo.type });

    if (erroUpload) {
      redirect(`/admin/topicos/${topico_id}?erro=${encodeURIComponent(erroUpload.message)}`);
    }

    const { data } = supabase.storage.from("materiais").getPublicUrl(caminho);
    conteudo = data.publicUrl;
  }

  if (!conteudo) {
    redirect(`/admin/topicos/${topico_id}?erro=${encodeURIComponent("Cole um link/código ou envie um arquivo.")}`);
  }

  await supabase.from("materiais").insert({ topico_id, tipo, titulo, conteudo });
  redirect(`/admin/topicos/${topico_id}`);
}

async function excluirMaterial(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = formData.get("id") as string;
  const topico_id = formData.get("topico_id") as string;
  await supabase.from("materiais").delete().eq("id", id);
  redirect(`/admin/topicos/${topico_id}`);
}

export default async function AdminTopicoPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { sucesso?: string; erro?: string };
}) {
  const supabase = createClient();

  const { data: topico } = await supabase
    .from("topicos")
    .select("id, titulo, categoria, ano, ordem, publicado, parent_id, slug")
    .eq("id", params.id)
    .single();

  if (!topico) notFound();

  const { data: materiais } = await supabase
    .from("materiais")
    .select("id, tipo, titulo, conteudo, ordem")
    .eq("topico_id", topico.id)
    .order("ordem");

  const { data: subtopicos } = await supabase
    .from("topicos")
    .select("id, titulo")
    .eq("parent_id", topico.id)
    .order("ordem");

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: 780 }}>
      <a href={`/admin/topicos?categoria=${topico.categoria}&ano=${topico.ano}`} style={{ fontSize: 13.5 }}>
        &larr; Voltar à lista
      </a>

      {searchParams.sucesso && (
        <div style={{ background: "#e6f3f1", color: "#1f6d63", padding: "10px 14px", borderRadius: 4, margin: "12px 0", fontSize: 13.5 }}>
          Salvo com sucesso.
        </div>
      )}
      {searchParams.erro && (
        <div style={{ background: "#fbe9e5", color: "#a13f2b", padding: "10px 14px", borderRadius: 4, margin: "12px 0", fontSize: 13.5 }}>
          Erro: {searchParams.erro}
        </div>
      )}

      <form action={atualizarTopico} className="card" style={{ padding: 20, margin: "16px 0" }}>
        <input type="hidden" name="id" value={topico.id} />
        <div className="field">
          <label htmlFor="titulo">Título</label>
          <input id="titulo" name="titulo" type="text" defaultValue={topico.titulo} required />
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="ordem">Ordem</label>
            <input id="ordem" name="ordem" type="number" defaultValue={topico.ordem} style={{ width: 80 }} />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5 }}>
            <input type="checkbox" name="publicado" defaultChecked={topico.publicado} style={{ width: "auto" }} />
            Publicado (visível no site)
          </label>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button type="submit" className="btn btn-primary">
            Salvar
          </button>
          <Link href={`/topico/${topico.slug}`} target="_blank" className="btn-text">
            Ver no site →
          </Link>
          <form style={{ marginLeft: "auto" }}>
            <input type="hidden" name="id" value={topico.id} />
            <input type="hidden" name="categoria" value={topico.categoria} />
            <input type="hidden" name="ano" value={topico.ano} />
            <input type="hidden" name="parent_id" value={topico.parent_id ?? ""} />
            <ConfirmButton
              formAction={excluirTopico}
              confirmText={`Excluir "${topico.titulo}" e todos os materiais/subtópicos dentro dele? Não pode ser desfeito.`}
              className="btn-text"
            >
              Excluir este tópico
            </ConfirmButton>
          </form>
        </div>
      </form>

      {/* --- Subtópicos --- */}
      <h2 style={{ fontSize: 16, margin: "28px 0 10px" }}>Subtópicos</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {(subtopicos ?? []).map((s) => (
          <Link key={s.id} href={`/admin/topicos/${s.id}`} className="card" style={{ padding: "10px 14px", textDecoration: "none", color: "var(--ink)" }}>
            {s.titulo}
          </Link>
        ))}
        {(subtopicos ?? []).length === 0 && <p style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>Nenhum subtópico.</p>}
      </div>
      <form action={criarSubtopico} className="card" style={{ padding: 16, display: "flex", gap: 10, alignItems: "end", marginBottom: 28 }}>
        <input type="hidden" name="parent_id" value={topico.id} />
        <input type="hidden" name="categoria" value={topico.categoria} />
        <input type="hidden" name="ano" value={topico.ano} />
        <div className="field" style={{ marginBottom: 0, flex: 1 }}>
          <label htmlFor="sub-titulo">Novo subtópico</label>
          <input id="sub-titulo" name="titulo" type="text" required placeholder="Ex.: O que a balança mede?" />
        </div>
        <button type="submit" className="btn btn-secondary">
          Adicionar
        </button>
      </form>

      {/* --- Materiais --- */}
      <h2 style={{ fontSize: 16, margin: "28px 0 10px" }}>Materiais</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {(materiais ?? []).map((m) => (
          <div key={m.id} className="card" style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div>
              <span className="tag">{m.tipo}</span>{" "}
              <strong style={{ fontSize: 14 }}>{m.titulo || "(sem título)"}</strong>
              <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4, maxWidth: 480, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.conteudo}
              </div>
            </div>
            <form>
              <input type="hidden" name="id" value={m.id} />
              <input type="hidden" name="topico_id" value={topico.id} />
              <ConfirmButton formAction={excluirMaterial} confirmText="Excluir este material?" className="btn-text">
                Excluir
              </ConfirmButton>
            </form>
          </div>
        ))}
        {(materiais ?? []).length === 0 && <p style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>Nenhum material ainda.</p>}
      </div>

      <form action={criarMaterial} className="card" style={{ padding: 20 }}>
        <input type="hidden" name="topico_id" value={topico.id} />
        <h3 style={{ margin: "0 0 12px", fontSize: 14 }}>Adicionar material</h3>
        <div className="field">
          <label htmlFor="tipo">Tipo</label>
          <select id="tipo" name="tipo" required defaultValue="embed">
            <option value="embed">Slide incorporado (código de embed)</option>
            <option value="video">Vídeo (URL de embed, ex.: YouTube)</option>
            <option value="pdf">PDF</option>
            <option value="imagem">Imagem</option>
            <option value="texto">Texto livre</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="mat-titulo">Título (opcional)</label>
          <input id="mat-titulo" name="titulo" type="text" />
        </div>
        <div className="field">
          <label htmlFor="conteudo">Link, código de embed ou texto</label>
          <textarea
            id="conteudo"
            name="conteudo"
            rows={4}
            placeholder="Cole aqui o código <iframe> do Google Slides/Canva, uma URL, ou o texto — ou deixe em branco e envie um arquivo abaixo"
          />
        </div>
        <div className="field">
          <label htmlFor="arquivo">Ou envie um arquivo (PDF ou imagem)</label>
          <input id="arquivo" name="arquivo" type="file" accept=".pdf,image/*" />
          <span style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>
            Se você enviar um arquivo aqui, ele é usado no lugar do link colado acima.
          </span>
        </div>
        <button type="submit" className="btn btn-primary">
          Adicionar material
        </button>
      </form>
    </div>
  );
}
