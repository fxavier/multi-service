
import MerchantVitrine from './MerchantVitrine';

interface MerchantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MerchantPage({ params }: MerchantPageProps) {
  const { slug } = await params;
  return <MerchantVitrine merchantSlug={slug} />;
}
