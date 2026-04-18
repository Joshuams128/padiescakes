import Reveal from './Reveal';

const quotes = [
  {
    body: 'Padie made the cake for our wedding and I am still getting texts about it six months later. Moist, beautifully piped, and delivered on time.',
    name: 'Ashley R.',
    context: 'Wedding, 2024',
  },
  {
    body: 'Ordered the 19-cupcake bouquet for my mum\u2019s 60th. She cried. Then she ate four of them.',
    name: 'Jordan M.',
    context: 'Birthday',
  },
  {
    body: 'We\u2019ve used Padie twice for corporate gifting. The packaging and the piping both look like a magazine.',
    name: 'Priya S.',
    context: 'Corporate order',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[color:var(--color-cream-50)] py-20 sm:py-24">
      <div className="container-custom">
        <Reveal className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-blush-400)]">
            Kind words
          </span>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight text-[color:var(--color-espresso-900)]">
            What our customers say
          </h2>
        </Reveal>

        <ul className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {quotes.map((q, i) => (
            <Reveal
              as="li"
              key={q.name}
              delay={i * 100}
              className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-20px_rgba(74,47,34,0.18)] border border-[color:var(--color-cream-200)]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 32 32"
                className="w-8 h-8 text-[color:var(--color-blush-300)] mb-5"
                fill="currentColor"
              >
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
              </svg>
              <p className="font-serif text-xl leading-snug text-[color:var(--color-espresso-900)]">
                {q.body}
              </p>
              <footer className="mt-6 text-sm">
                <div className="font-medium text-[color:var(--color-espresso-900)]">
                  {q.name}
                </div>
                <div className="text-[color:var(--color-espresso-500)]">
                  {q.context}
                </div>
              </footer>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
