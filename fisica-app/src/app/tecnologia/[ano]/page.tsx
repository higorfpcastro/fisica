import ListaPorCategoria from "@/app/components/ListaPorCategoria";

export default function TecnologiaPage({ params }: { params: { ano: string } }) {
  return <ListaPorCategoria categoria="tecnologia" basePath="/tecnologia" ano={parseInt(params.ano, 10)} />;
}
