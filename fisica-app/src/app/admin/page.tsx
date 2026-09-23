import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function sair() {
  "use server";
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const SECOES = [
  { categoria: "conteudo", label: "Conteúdo (1º/2º/3º Ano)" },
  { categoria: "atividades", label: "Atividades" },
  { categoria: "simulacoes", label: "Simulações" },
  { categoria: "tabelas", label: "Tabelas" },
  { categoria: "tecnologia", label: "Tecnologia e Inovação" },
];

const PAGINAS_ESTATICAS = [
  { slug: "cronograma", label: "Cronograma" },
  { slug: "horario", label: "Horário" },
  { slug: "astronomia", label: "Astronomia" },
  { slug: "dicas", label: "Dicas" },
  { slug: "contato", label: "Contato" },
];

export default function AdminPage() {
  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>Painel do professor</h1>
        <form action={sair}>
          <button type="submit" className="btn-text">
            Sair
          </button>
        </form>
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Tópicos por seção</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 32 }}>
        {SECOES.map((s) => (
          <Link key={s.categoria} href={`/admin/topicos?categoria=${s.categoria}`} className="card" style={{ padding: "16px 18px", textDecoration: "none", color: "var(--ink)", fontWeight: 600 }}>
            {s.label}
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Páginas estáticas</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 32 }}>
        {PAGINAS_ESTATICAS.map((p) => (
          <Link key={p.slug} href={`/admin/paginas/${p.slug}`} className="card" style={{ padding: "16px 18px", textDecoration: "none", color: "var(--ink)", fontWeight: 600 }}>
            {p.label}
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Outras seções</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        <Link href="/admin/noticias" className="card" style={{ padding: "16px 18px", textDecoration: "none", color: "var(--ink)", fontWeight: 600 }}>
          Notícias
        </Link>
        <Link href="/admin/duvidas" className="card" style={{ padding: "16px 18px", textDecoration: "none", color: "var(--ink)", fontWeight: 600 }}>
          Dúvidas frequentes
        </Link>
      </div>
    </div>
  );
}
