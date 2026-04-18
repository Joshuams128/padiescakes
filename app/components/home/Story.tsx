import Image from 'next/image';
import Reveal from './Reveal';

export default function Story() {
  return (
    <section className="bg-[color:var(--color-blush-50)] py-20 sm:py-28">
      <div className="container-custom grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 rounded-[24px] overflow-hidden">
            <Image
              src="/images/44-Cupcake-Bouquet-scaled.jpg"
              alt="A hand-piped cupcake bouquet from Padie's Cakes"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 80vw, 40vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={120}>
          <span className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-blush-400)]">
            Our story
          </span>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight text-[color:var(--color-espresso-900)] leading-[1.05] max-w-xl">
            One kitchen. One piping bag. Every cake made by hand.
          </h2>
          <div className="mt-6 space-y-5 text-[color:var(--color-espresso-700)] text-lg leading-relaxed max-w-xl">
            <p>
              Padie started piping buttercream roses for her sister&apos;s
              birthday in 2019. One cake turned into twenty, then two hundred,
              and now she bakes for weddings, christenings, and Tuesday
              afternoons that deserve something sweeter.
            </p>
            <p>
              We don&apos;t do mass-produced. Every order is made to spec, in
              real butter, and walked out of our kitchen in Toronto — usually
              still warm from the oven.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <span
              className="font-serif italic text-3xl text-[color:var(--color-espresso-900)]"
              style={{ letterSpacing: '-0.01em' }}
            >
              — Padie
            </span>
            <span className="text-sm text-[color:var(--color-espresso-500)]">
              Owner &amp; head baker
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
