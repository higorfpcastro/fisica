import { createClient } from "@/lib/supabase/server";

export async function buscarTopicos(categoria: string, ano: number) {
  const supabase = createClient();
  const { data } = await supabase
    .from("topicos")
    .select("id, titulo, slug")
    .eq("categoria", categoria)
    .eq("ano", ano)
    .is("parent_id", null)
    .eq("publicado", true)
    .order("ordem");
  return data ?? [];
}

export const CATEGORIA_LABEL: Record<string, string> = {
  conteudo: "Conteúdo",
  atividades: "Atividades",
  simulacoes: "Simulações",
  tabelas: "Tabelas",
  tecnologia: "Tecnologia e Inovação",
};
