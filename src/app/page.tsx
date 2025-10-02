
import HeroSection from '@/components/home/HeroSection';
import MerchantsCarousel from '@/components/home/MerchantsCarousel';
import CategoriasGrid from '@/components/home/CategoriasGrid';
import ServicosDestaque from '@/components/home/ServicosDestaque';
import CadastroSection from '@/components/home/CadastroSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <MerchantsCarousel />
      <CategoriasGrid />
      <ServicosDestaque />
      <CadastroSection />
    </>
  );
}
