import { CloudUpload, Cpu, FileCheck } from 'lucide-react';
import Reveal from '../motion/Reveal';
import Stagger from '../motion/Stagger';

export default function HowItWorks() {
  const steps = [
    { icon: CloudUpload, title: "Upload", desc: "Drag & drop your video, image, or text caption. We handle all major formats." },
    { icon: Cpu, title: "We Analyze", desc: "Our AI scans frames, text, and audio against ASCI guidelines and other regulations." },
    { icon: FileCheck, title: "Get Your Report", desc: "Receive a detailed compliance score, issue breakdowns, and suggested rewrites." }
  ];

  return (
    <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">How it works</h2>
        <p className="text-lg text-[var(--color-text-muted)]">Three simple steps to ad compliance.</p>
      </Reveal>

      <Stagger className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Desktop connecting line */}
        <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 bg-[var(--color-border)] z-0 -translate-y-1/2 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-violet-500 via-accent-cyan to-violet-500 animate-shimmer opacity-50" />
        </div>

        {steps.map((step, i) => (
          <Reveal key={i} delay={i * 0.2} className="relative z-10">
            <div className="glass rounded-3xl p-8 flex flex-col items-center text-center h-full hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-transparent flex items-center justify-center mb-6 shadow-glow-violet">
                <step.icon className="w-8 h-8 text-violet-400" />
              </div>
              <div className="absolute top-4 right-6 text-6xl font-display font-bold text-white/5 pointer-events-none">
                0{i + 1}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-[var(--color-text-muted)]">{step.desc}</p>
            </div>
          </Reveal>
        ))}
      </Stagger>
    </section>
  );
}
