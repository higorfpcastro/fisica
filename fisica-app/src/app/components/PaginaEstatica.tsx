import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function PaginaEstatica({ slug }: { slug: string }) {
  const supabase = createClient();
  const { data: pagina } = await supabase.from("paginas").select("titulo, corpo_html").eq("slug", slug).single();

  if (!pagina) notFound();

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>{pagina.titulo}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: pagina.corpo_html }} />
    </div>
  );
}
