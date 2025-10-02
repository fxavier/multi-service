
import PrestadorDetalhes from './PrestadorDetalhes';

interface PrestadorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PrestadorPage({ params }: PrestadorPageProps) {
  const { id } = await params;
  return <PrestadorDetalhes prestadorId={id} />;
}
