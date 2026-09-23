import { createClient } from "@/lib/supabase/server";
import ConfirmButton from "@/app/components/ConfirmButton";
import { redirect } from "next/navigation";

async function criarDuvida(formData: FormData) {
  "use server";
  const supabase = createClient();
  const pergunta = formData.get("pergunta") as string;
  const resposta = formData.get("resposta") as string;
  await supabase.from("duvidas").insert({ pergunta, resposta });
  redirect("/admin/duvidas");
}

async function atualizarDuvida(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = formData.get("id") as string;
  const pergunta = formData.get("pergunta") as string;
  const resposta = formData.get("resposta") as string;
  await supabase.from("duvidas").update({ pergunta, resposta }).eq("id", id);
  redirect("/admin/duvidas?sucesso=1");
}

async function excluirDuvida(formData: FormData) {
  "use server";
  const supabase = createClient();
  const id = formData.get("id") as string;
  await supabase.from("duvidas").delete().eq("id", id);
  redirect("/admin/duvidas");
}

export default async function AdminDuvidasPage({ searchParams }: { searchParams: { sucesso?: string } }) {
  const supabase = createClient();
  const { data: duvidas } = await supabase.from("duvidas").select("id, pergunta, resposta, ordem").order("ordem");

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: 720 }}>
      <a href="/admin" style={{ fontSize: 13.5 }}>
        &larr; Voltar ao painel
      </a>
      <h1 style={{ fontSize: 24, margin: "10px 0 20px" }}>Dúvidas frequentes</h1>

      {searchParams.sucesso && (
        <div style={{ background: "#e6f3f1", color: "#1f6d63", padding: "10px 14px", borderRadius: 4, marginBottom: 16, fontSize: 13.5 }}>
          Salvo com sucesso.
        </div>
      )}

      <form action={criarDuvida} className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 14 }}>Nova pergunta</h3>
        <div className="field">
          <label htmlFor="pergunta">Pergunta</label>
          <input id="pergunta" name="pergunta" type="text" required />
        </div>
        <div className="field">
          <label htmlFor="resposta">Resposta</label>
          <textarea id="resposta" name="resposta" rows={3} required />
        </div>
        <button type="submit" className="btn btn-primary">
          Adicionar
        </button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {(duvidas ?? []).map((d) => (
          <form key={d.id} action={atualizarDuvida} className="card" style={{ padding: 18 }}>
            <input type="hidden" name="id" value={d.id} />
            <div className="field">
              <label>Pergunta</label>
              <input name="pergunta" type="text" defaultValue={d.pergunta} required />
            </div>
            <div className="field">
              <label>Resposta</label>
              <textarea name="resposta" rows={3} defaultValue={d.resposta} required />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn btn-secondary">
                Salvar
              </button>
              <ConfirmButton formAction={excluirDuvida} confirmText="Excluir esta pergunta?" className="btn-text">
                Excluir
              </ConfirmButton>
            </div>
          </form>
        ))}
        {(duvidas ?? []).length === 0 && <p style={{ color: "var(--ink-soft)" }}>Nenhuma dúvida cadastrada ainda.</p>}
      </div>
    </div>
  );
}
