"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Botão de anexar arquivo reutilizável. Sobe o arquivo para o Supabase
 * Storage e insere a URL resultante no campo de destino (`targetId`):
 * - modo "url": substitui o valor do campo pela URL do arquivo (para
 *   campos como "Imagem de capa").
 * - modo "html": insere um <img> ou <a> com o arquivo dentro de um
 *   textarea de conteúdo HTML, sem apagar o que já estava escrito.
 */
export default function AnexarArquivo({ targetId, modo }: { targetId: string; modo: "html" | "url" }) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleUpload() {
    const arquivo = inputRef.current?.files?.[0];
    if (!arquivo) return;
    setEnviando(true);
    setErro(null);

    const caminho = `anexos/${Date.now()}-${arquivo.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("materiais").upload(caminho, arquivo, {
      contentType: arquivo.type,
    });

    if (error) {
      setErro(error.message);
      setEnviando(false);
      return;
    }

    const { data } = supabase.storage.from("materiais").getPublicUrl(caminho);
    const url = data.publicUrl;

    const target = document.getElementById(targetId) as HTMLTextAreaElement | HTMLInputElement | null;
    if (target) {
      if (modo === "url") {
        target.value = url;
      } else {
        const trecho = arquivo.type.startsWith("image/")
          ? `<img src="${url}" alt="" />`
          : `<a href="${url}" target="_blank" rel="noopener noreferrer">${arquivo.name}</a>`;
        target.value = target.value + (target.value ? "\n" : "") + trecho;
      }
      // Garante que o React "veja" a mudança se algum listener estiver ouvindo.
      target.dispatchEvent(new Event("input", { bubbles: true }));
    }

    if (inputRef.current) inputRef.current.value = "";
    setEnviando(false);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
      <input ref={inputRef} type="file" accept=".pdf,image/*" style={{ fontSize: 12.5, maxWidth: 220 }} />
      <button type="button" className="btn btn-secondary" onClick={handleUpload} disabled={enviando}>
        {enviando ? "Enviando..." : "📎 Anexar"}
      </button>
      {erro && <span style={{ color: "#a13f2b", fontSize: 12 }}>{erro}</span>}
    </div>
  );
}
