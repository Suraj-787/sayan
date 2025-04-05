"use client"

import { motion } from "framer-motion"
import Tilt from "react-parallax-tilt"

export default function AboutPage() {
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  }

  return (
    <main className="container py-16 max-w-4xl mx-auto">
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-primary mb-4">
          Empowering Access to Government Schemes
        </h1>
        <p className="text-xl text-muted-foreground">
          Discover the right schemes. Get answers instantly. All in one beautifully simple platform.
        </p>
      </motion.section>

      <section className="grid gap-10">
        {[
          {
            title: " Centralized Scheme Access",
            desc: "Find all government schemes in one place. Filter, explore, and get what’s relevant to you without confusion.",
          },
          {
            title: " AI-Powered Assistance",
            desc: "Have questions? Our AI assistant, powered by Google Gemini, gives instant, personalized answers about eligibility, benefits, and documents.",
          },
          {
            title: " Multilingual & Voice Friendly",
            desc: "Speak or type — in your own language. With Sarvam TTS/STT, we support seamless voice and language accessibility for all users.",
          },
          {
            title: " Web & WhatsApp Access",
            desc: "Whether you're on a browser or chatting on WhatsApp, you get the same powerful experience — anytime, anywhere.",
          },
          {
            title: " Built for Real Impact",
            desc: "We’re not just another tech project. We're solving real access problems using AI — making sure no one misses out on what they deserve.",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={cardVariants}
          >
            <Tilt glareEnable={true} glareMaxOpacity={0.1} scale={1.02} tiltMaxAngleX={6} tiltMaxAngleY={6}>
              <div className="rounded-2xl p-6 shadow-md bg-card border border-border transition-all hover:shadow-xl">
                <h2 className="text-2xl font-semibold mb-2 text-primary">{card.title}</h2>
                <p className="text-muted-foreground text-lg">{card.desc}</p>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </section>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-center mt-16"
      >
        <a
          href="/schemes"
          className="inline-block px-8 py-4 text-lg font-semibold rounded-full bg-primary text-white shadow-md hover:shadow-xl transition-all hover:scale-105"
        >
          Start Exploring Schemes →
        </a>
      </motion.div>
    </main>
  )
}
