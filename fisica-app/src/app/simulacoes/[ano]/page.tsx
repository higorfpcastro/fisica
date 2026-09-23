import ListaPorCategoria from "@/app/components/ListaPorCategoria";

export default function SimulacoesPage({ params }: { params: { ano: string } }) {
  return <ListaPorCategoria categoria="simulacoes" basePath="/simulacoes" ano={parseInt(params.ano, 10)} />;
}
