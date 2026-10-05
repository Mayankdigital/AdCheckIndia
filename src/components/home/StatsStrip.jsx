import CountUp from '../motion/CountUp';
import Reveal from '../motion/Reveal';

export default function StatsStrip() {
  return (
    <section className="py-16 border-y border-white/10 bg-black/20 backdrop-blur-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="py-4 md:py-0">
              <CountUp end={60} suffix="s" prefix="< " label="Average check time" />
            </div>
            <div className="py-4 md:py-0">
              <CountUp end={9} label="Ad categories covered" />
            </div>
            <div className="py-4 md:py-0">
              <CountUp end={50} suffix="+" label="Rule types checked" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
