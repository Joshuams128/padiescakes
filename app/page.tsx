import Hero from './components/home/Hero';
import SignatureCakes from './components/home/SignatureCakes';
import Story from './components/home/Story';
import FinalCTA from './components/home/FinalCTA';

export default function HomePage() {
  return (
    <main className="bg-[color:var(--color-cream-50)] text-[color:var(--color-espresso-900)]">
      <Hero />
      <SignatureCakes />
      <Story />
      <FinalCTA />
    </main>
  );
}
