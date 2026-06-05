import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Timeline from '@/components/home/Timeline';
import StatsBlock from '@/components/home/StatsBlock';
import Tokenomics from '@/components/home/Tokenomics';
import Community from '@/components/home/Community';

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Timeline />
      <StatsBlock />
      <Tokenomics />
      <Community />
      <Footer />
    </main>
  );
}
