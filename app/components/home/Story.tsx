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
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight text-[color:var(--color-espresso-900)] leading-[1.05] max-w-xl">
Designed for weddings, celebrations, and unforgettable moments.          </h2>
          <div className="mt-6 space-y-5 text-[color:var(--color-espresso-700)] text-lg leading-relaxed max-w-xl">
            <p>
Indulge in a statement-making centerpiece with our 44 Floral Cupcake Bouquet, a luxurious arrangement featuring forty-four beautifully crafted cupcakes, each intricately decorated to resemble delicate, hand-formed blooms in soft, elegant tones. Designed to reflect the sophistication of a fresh floral display, every cupcake showcases refined piping and detailed artistry, making it perfect for weddings, upscale celebrations, and large party affairs. With its impressive size and cohesive design, this bouquet serves as both a stunning focal point and a delicious treat, leaving a lasting impression on every guest.            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
