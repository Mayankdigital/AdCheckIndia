import { Briefcase, Building2, Users, Volume2 } from 'lucide-react';
import Reveal from '../motion/Reveal';

const CARDS = [
  {
    id: 'agencies',
    label: 'Agencies',
    icon: Briefcase,
    bgColor: 'bg-[#EEF0FF]',
    iconColor: 'text-indigo-500',
    titleColor: 'text-[#1B2B5E]',
    title: 'Protect every client campaign',
    benefits: [
      'Review client creatives before they go to approval',
      'Share one clear report that shows each flagged claim',
      'Keep a record of every check for your whole team',
    ],
  },
  {
    id: 'brands',
    label: 'D2C Brands',
    icon: Building2,
    bgColor: 'bg-[#FFF4E5]',
    iconColor: 'text-[#E07B00]',
    titleColor: 'text-[#E07B00]',
    title: 'Launch without the last-minute scramble',
    benefits: [
      'Check copy, visuals, and claims in under 60 seconds',
      'Fix risky health and results claims before launch',
      'Catch the obvious issues before legal review',
    ],
  },
  {
    id: 'managers',
    label: 'Influencer Managers',
    icon: Users,
    bgColor: 'bg-[#F0FAF0]',
    iconColor: 'text-[#138808]',
    titleColor: 'text-[#138808]',
    title: 'Keep every creator on the right side',
    benefits: [
      'Check disclosure visibility (#ad) across your roster',
      'Spot material connections that are not declared',
      'Send creators clear fixes instead of vague feedback',
    ],
  },
  {
    id: 'creators',
    label: 'Creators',
    icon: Volume2,
    bgColor: 'bg-[#FFF4E5]',
    iconColor: 'text-[#E07B00]',
    titleColor: 'text-[#E07B00]',
    title: 'Post with confidence',
    benefits: [
      'Quickly check sponsored content before hitting publish',
      "Ensure you aren't liable for brand claims",
      'Know exactly what to change, and why',
    ],
  },
];

export default function WhoItsFor() {
  return (
    <section className="py-20 w-full">
      <Reveal className="text-center mb-12 px-4">
        <h2 className="text-4xl md:text-6xl font-bold font-display mb-4 text-[#1B2B5E]">Who is it for?</h2>
        <div className="flex justify-center gap-2 mb-4">
          <div className="h-1 w-8 bg-[#E07B00] rounded-full" />
          <div className="h-1 w-8 bg-gray-200 rounded-full" />
          <div className="h-1 w-8 bg-[#138808] rounded-full" />
        </div>
        <p className="text-lg text-gray-500">Built for everyone in the advertising ecosystem.</p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[1400px] mx-auto px-4 sm:px-8">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="flex items-stretch bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Left icon block */}
              <div className={`${card.bgColor} flex flex-col items-center justify-center px-6 py-8 min-w-[110px] shrink-0`}>
                <div className={`w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <span className={`text-xs font-bold font-display text-center leading-tight ${card.iconColor}`}>{card.label}</span>
              </div>

              {/* Dashed divider */}
              <div className="w-px border-l border-dashed border-gray-300 my-6" />

              {/* Right content */}
              <div className="flex-1 p-6">
                <h3 className={`text-[17px] font-black font-display mb-4 leading-snug ${card.titleColor}`}>{card.title}</h3>
                <ul className="space-y-2.5">
                  {card.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-[#138808] shrink-0 inline-block" />
                      <span className="text-sm font-body text-gray-600 leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
