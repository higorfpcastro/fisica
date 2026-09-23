import { createClient } from "@/lib/supabase/server";

export default async function DuvidasPage() {
  const supabase = createClient();
  const { data: duvidas } = await supabase.from("duvidas").select("id, pergunta, resposta").order("ordem");

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Dúvidas frequentes</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(duvidas ?? []).map((d) => (
          <div key={d.id} className="card" style={{ padding: "18px 20px" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{d.pergunta}</div>
            <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>{d.resposta}</div>
          </div>
        ))}
        {(duvidas ?? []).length === 0 && <p style={{ color: "var(--ink-soft)" }}>Nenhuma dúvida cadastrada ainda.</p>}
      </div>
    </div>
  );
}
