"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    setCarregando(false);

    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="container" style={{ padding: "64px 24px", maxWidth: 420 }}>
      <form onSubmit={handleSubmit} className="card" style={{ padding: "32px 28px" }}>
        <h1 style={{ fontSize: 22, margin: "0 0 4px" }}>Entrar</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5, marginTop: 0, marginBottom: 22 }}>
          Área restrita ao professor, para editar o conteúdo do site.
        </p>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        {erro && <p style={{ color: "#B5533C", fontSize: 13, marginTop: -8, marginBottom: 16 }}>{erro}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
