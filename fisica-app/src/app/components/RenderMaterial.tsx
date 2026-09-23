type Material = {
  id: string;
  tipo: "embed" | "pdf" | "video" | "texto" | "imagem";
  titulo: string | null;
  conteudo: string;
};

export default function RenderMaterial({ material }: { material: Material }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {material.titulo && <h3 style={{ fontSize: 17, marginBottom: 10 }}>{material.titulo}</h3>}

      {material.tipo === "embed" && (
        <div className="material-embed" dangerouslySetInnerHTML={{ __html: material.conteudo }} />
      )}

      {material.tipo === "video" && (
        <div className="material-embed">
          <iframe src={material.conteudo} allowFullScreen />
        </div>
      )}

      {material.tipo === "imagem" && (
        <img src={material.conteudo} alt={material.titulo ?? ""} style={{ maxWidth: "100%", borderRadius: 6 }} />
      )}

      {material.tipo === "pdf" && (
        <a href={material.conteudo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          📄 Baixar / abrir PDF
        </a>
      )}

      {material.tipo === "texto" && (
        <div className="prose" style={{ whiteSpace: "pre-wrap", fontSize: 15 }}>
          {material.conteudo}
        </div>
      )}
    </div>
  );
}
