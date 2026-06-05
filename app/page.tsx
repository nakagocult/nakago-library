import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Timeline from '@/components/home/Timeline';
import StatsBlock from '@/components/home/StatsBlock';
import Tokenomics from '@/components/home/Tokenomics';
import Community from '@/components/home/Community';
import HomeChart from '@/components/home/HomeChart';
import HomeDdergo from '@/components/home/HomeDdergo';
import HomeCTABar from '@/components/home/HomeCTABar';

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <HomeCTABar />
      <StatsBlock />
      <Timeline />
      <HomeChart />
      <Tokenomics />
      <HomeDdergo />
      <Community />
      <Footer />
    </main>
  );
}
