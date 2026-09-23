import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MobileMenuToggle from "@/app/components/MobileMenuToggle";

export default async function Navbar() {
  const supabase = createClient();

  const { data: topicosConteudo } = await supabase
    .from("topicos")
    .select("id, ano, titulo, slug")
    .eq("categoria", "conteudo")
    .is("parent_id", null)
    .eq("publicado", true)
    .order("ordem");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const porAno = (ano: number) => (topicosConteudo ?? []).filter((t) => t.ano === ano);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand">
          <span className="mark">F</span>
          <span>Física</span>
        </Link>

        <MobileMenuToggle>
          <nav className="nav-links" id="nav-links">
            {[1, 2, 3].map((ano) => (
              <details className="dropdown" key={ano}>
                <summary>{ano}º Ano</summary>
                <div className="dropdown-panel">
                  {porAno(ano).length === 0 && (
                    <span style={{ display: "block", padding: "8px 10px", color: "var(--ink-soft)", fontSize: 13 }}>
                      Em breve
                    </span>
                  )}
                  {porAno(ano).map((t) => (
                    <Link key={t.id} href={`/topico/${t.slug}`}>
                      {t.titulo}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
            <Link href="/atividades/1">Atividades</Link>
            <Link href="/simulacoes/1">Simulações</Link>
            <Link href="/tabelas/1">Tabelas</Link>
            <Link href="/astronomia">Astronomia</Link>
            <Link href="/tecnologia/1">Tecnologia</Link>
            <Link href="/noticias">Notícias</Link>
            <Link href="/dicas">Dicas</Link>
            <Link href="/duvidas">Dúvidas</Link>
            <Link href="/cronograma">Cronograma</Link>
            <Link href="/horario">Horário</Link>
            <Link href="/contato">Contato</Link>
            {user ? (
              <Link href="/admin">Painel</Link>
            ) : (
              <Link href="/login">Entrar</Link>
            )}
          </nav>
        </MobileMenuToggle>
      </div>
    </header>
  );
}
