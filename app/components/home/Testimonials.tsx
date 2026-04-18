'use client';

import Reveal from './Reveal';

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

        <Reveal>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2883.0929587789505!2d-79.3876!3d43.6629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x84d0d07f09d68a41!2sP!5e0!3m2!1sen!2sca!4v1234567890"
            width="100%"
            height="500"
            style={{ border: 0, borderRadius: '16px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="shadow-[0_10px_40px_-20px_rgba(74,47,34,0.18)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
