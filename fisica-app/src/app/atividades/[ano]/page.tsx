import ListaPorCategoria from "@/app/components/ListaPorCategoria";

export default function AtividadesPage({ params }: { params: { ano: string } }) {
  return <ListaPorCategoria categoria="atividades" basePath="/atividades" ano={parseInt(params.ano, 10)} />;
}
