import { useState } from 'react';
import { Search, BookOpen, Clock, FileEdit, Users, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '../motion/Reveal';

export default function FeaturesBento() {
  const [activeTab, setActiveTab] = useState('claim-detection');

  const features = [
    {
      id: 'claim-detection',
      title: 'Intelligent Claim Detection',
      description: 'Our AI reads between the lines, detecting absolute claims, unverified health statements, and misleading comparisons across text, video, and audio.',
      icon: Search,
      color: 'text-[#E07B00]',
      bg: 'bg-[#E07B00]/10',
      content: (
        <div className="mt-4 bg-[#1B2B5E] rounded-xl p-6 font-mono text-sm border border-white/10 relative overflow-hidden flex flex-col justify-center text-white shadow-lg w-full max-w-lg mx-auto">
          <div className="text-[#22c55e] mb-2">$ analyze_claims --source video.mp4</div>
          <div className="text-white/60 mb-2">&gt; Scanning audio transcript...</div>
          <div className="text-red-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Found: "Guaranteed results in 2 days"
            <span className="w-2 h-4 bg-white/70 animate-pulse ml-1 inline-block" />
          </div>
        </div>
      )
    },
    {
      id: 'rule-citations',
      title: 'Direct Rule Citations',
      description: 'We don\'t just say it\'s wrong. We cite the exact ASCI rule code so you know exactly why.',
      icon: BookOpen,
      color: 'text-[#138808]',
      bg: 'bg-[#138808]/10',
      content: (
        <div className="mt-12 flex items-center justify-center">
          <div className="px-6 py-4 rounded-xl bg-orange-50 border border-[#E07B00]/30 text-sm text-[#E07B00] font-mono shadow-md">
            ASCI-H-1: "Claims must be substantiated..."
          </div>
        </div>
      )
    },
    {
      id: 'video-timestamps',
      title: 'Video Timestamps',
      description: 'Click an issue to jump instantly to the exact second in your video where the violation occurs.',
      icon: Clock,
      color: 'text-indigo-800',
      bg: 'bg-indigo-800/10',
      content: (
        <div className="mt-20 flex flex-col items-center justify-center w-full max-w-md mx-auto">
          <div className="w-full h-3 bg-gray-200 rounded-full relative shadow-inner flex items-center">
            <div className="absolute left-[20%] flex flex-col items-center -translate-x-1/2">
              <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-md z-10" />
              <span className="text-[10px] font-bold text-red-600 mt-2">0:12</span>
            </div>
            <div className="absolute left-[70%] flex flex-col items-center -translate-x-1/2">
              <div className="w-4 h-4 rounded-full bg-[#E07B00] border-2 border-white shadow-md z-10" />
              <span className="text-[10px] font-bold text-[#E07B00] mt-2">0:41</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'compliant-rewrites',
      title: 'Compliant Rewrites',
      description: 'Get AI-generated suggestions that keep your message while staying compliant.',
      icon: FileEdit,
      color: 'text-[#138808]',
      bg: 'bg-[#138808]/10',
      content: (
        <div className="mt-8 flex flex-col justify-center space-y-4 max-w-lg mx-auto">
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm line-through text-red-800 shadow-sm relative">
            Cures all skin problems instantly
          </div>
          <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-800 shadow-sm relative">
            Helps improve skin texture over time*
          </div>
        </div>
      )
    },
    {
      id: 'influencer-mode',
      title: 'Influencer Mode',
      description: 'Specialized checks for influencer guidelines, including disclosure visibility (#ad) and material connections.',
      icon: Users,
      color: 'text-indigo-800',
      bg: 'bg-indigo-800/10',
      content: (
        <div className="mt-16 flex flex-wrap gap-4 items-center justify-center">
          <div className="px-5 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-bold shadow-sm">
            #ad visible
          </div>
          <div className="px-5 py-2 rounded-full bg-white border border-gray-200 text-indigo-950 text-sm font-bold shadow-sm">
            Material connection
          </div>
          <div className="px-5 py-2 rounded-full bg-white border border-gray-200 text-indigo-950 text-sm font-bold shadow-sm">
            Disclosure placement
          </div>
        </div>
      )
    },
    {
      id: 'report-history',
      title: 'Report History',
      description: 'All your past reports saved locally in your browser. Easily export them as PDFs for your compliance team.',
      icon: History,
      color: 'text-[#E07B00]',
      bg: 'bg-[#E07B00]/10',
      content: (
        <div className="mt-12 flex justify-center gap-4">
          <div className="w-16 h-20 bg-white rounded-lg border border-gray-200 shadow-md transform -rotate-6 translate-x-4"></div>
          <div className="w-16 h-20 bg-white rounded-lg border border-gray-200 shadow-lg z-10 flex flex-col justify-between p-2">
            <div className="w-4 h-1 bg-[#E07B00] rounded-full"></div>
            <div className="space-y-1">
              <div className="w-full h-1 bg-gray-100 rounded-full"></div>
              <div className="w-3/4 h-1 bg-gray-100 rounded-full"></div>
            </div>
          </div>
          <div className="w-16 h-20 bg-white rounded-lg border border-gray-200 shadow-md transform rotate-6 -translate-x-4"></div>
        </div>
      )
    }
  ];

  const activeContent = features.find(f => f.id === activeTab);

  return (
    <section id="features" className="py-20 w-full">
      <Reveal className="text-center mb-12 px-4">
        <h2 className="text-4xl md:text-6xl font-bold font-display mb-4 text-[#1B2B5E]">Everything you need</h2>
        <div className="flex justify-center gap-2 mb-4">
          <div className="h-1 w-8 bg-[#E07B00] rounded-full" />
          <div className="h-1 w-8 bg-gray-200 rounded-full" />
          <div className="h-1 w-8 bg-[#138808] rounded-full" />
        </div>
        <p className="text-lg text-gray-500">Powerful features built for the modern marketing workflow.</p>
      </Reveal>

      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto px-4 sm:px-8 gap-6 items-stretch">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-[310px] shrink-0 flex flex-col gap-2">
          {features.map((f, idx) => {
            const isActive = activeTab === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-200 outline-none ${
                  isActive
                    ? 'bg-white border-[2.5px] border-[#1B2B5E] shadow-[5px_5px_0_#E07B00]'
                    : 'bg-white border-[1.5px] border-gray-300 hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${f.bg} ${f.color}`}>
                  <f.icon style={{ width: 18, height: 18 }} />
                </div>
                <span className={`font-semibold text-[15px] ${isActive ? 'text-[#1B2B5E]' : 'text-gray-600'}`}>{f.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area — flex-1 + h-full for equal height */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 h-full flex flex-col" style={{ minHeight: 480 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="p-8 md:p-10 flex flex-col flex-1"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${activeContent.bg} ${activeContent.color}`}>
                    <activeContent.icon style={{ width: 22, height: 22 }} />
                  </div>
                  <h3 className="text-2xl font-black text-[#1B2B5E]">{activeContent.title}</h3>
                </div>
                <p className="text-gray-500 mb-6 text-[15px] leading-relaxed">{activeContent.description}</p>

                {/* Visual Area */}
                <div className="flex-1 rounded-2xl bg-[#f8f9fb] border border-gray-100 relative overflow-hidden bg-grid-india p-6 min-h-[200px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8f9fb]/80 pointer-events-none" />
                  <div className="relative z-10 w-full h-full">
                    {activeContent.content}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
