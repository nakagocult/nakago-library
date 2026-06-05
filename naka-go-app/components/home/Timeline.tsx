'use client';

import { motion } from 'framer-motion';

const timelineData = [
  {
    year: '1948',
    title: 'Birth of a Legend',
    text: 'Naka Go of Akaishi-so was born just after World War II devastated Japan. The Shiba Inu breed faced extinction from disease, famine, and the ravages of war.',
    emoji: '🌸',
    color: '#FF4D00',
  },
  {
    year: '1950s',
    title: 'The Foundation',
    text: "Naka Go became the cornerstone of the Akaishi bloodline. His exceptional traits — strong structure, noble expression, independent spirit — defined the breed standard recognized by NIPPO.",
    emoji: '🏛️',
    color: '#FF6600',
  },
  {
    year: '1960s–90s',
    title: 'The Legacy Spreads',
    text: 'Through careful breeding, Naka Go\'s genetics spread globally. Over 80% of modern Shiba Inus trace their lineage back to him — making him the most influential Shiba in history.',
    emoji: '🌍',
    color: '#FF4D00',
  },
  {
    year: 'Today',
    title: 'Eternal Impact',
    text: 'Without Naka Go, the Shiba Inu — and the Doge meme — might not exist today. His legacy lives on through $NAKA, honoring the dog who saved his breed.',
    emoji: '🐕',
    color: '#FF0000',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

export default function Timeline() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#FF4D00] text-sm font-bold uppercase tracking-widest mb-3 block">
            True Story
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] mb-4"
            style={{ fontFamily: 'var(--font-permanent-marker)' }}
          >
            The Legend of Naka Go
          </h2>
          <p className="text-[#666] text-lg max-w-2xl mx-auto leading-relaxed">
            A real dog. A real story. The genetic savior of a breed.
          </p>
        </motion.div>

        {/* Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {timelineData.map((item, i) => (
            <motion.div
              key={item.year}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl border border-gray-100 cursor-default"
            >
              {/* Year badge */}
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full text-white text-lg font-bold mb-4 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${item.color}, #FF0000)`,
                  fontFamily: 'var(--font-permanent-marker)',
                  boxShadow: `0 0 20px ${item.color}60`,
                }}
              >
                {item.emoji}
              </div>

              {/* Year label */}
              <div
                className="text-sm font-bold mb-2"
                style={{ color: item.color, fontFamily: 'var(--font-permanent-marker)' }}
              >
                {item.year}
              </div>

              {/* Title */}
              <h3
                className="text-xl text-[#1a1a1a] mb-3"
                style={{ fontFamily: 'var(--font-permanent-marker)' }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[#666] text-sm leading-relaxed mb-4">{item.text}</p>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-bold px-4 py-2 rounded-full text-white transition-all"
                style={{
                  background: `linear-gradient(135deg, ${item.color}, #FF0000)`,
                  fontFamily: 'var(--font-permanent-marker)',
                  boxShadow: `0 0 10px ${item.color}40`,
                }}
              >
                Learn More
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
