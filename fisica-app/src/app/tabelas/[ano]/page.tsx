import ListaPorCategoria from "@/app/components/ListaPorCategoria";

export default function TabelasPage({ params }: { params: { ano: string } }) {
  return <ListaPorCategoria categoria="tabelas" basePath="/tabelas" ano={parseInt(params.ano, 10)} />;
}
