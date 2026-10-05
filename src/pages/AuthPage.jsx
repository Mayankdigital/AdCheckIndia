import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, User, Check, ArrowRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';

// --- Carousel Graphics Components ---

function Slide1Graphic() {
  return (
    <div className="w-80 bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col mb-10 transform -rotate-1">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-full bg-[#E07B00] text-white flex items-center justify-center font-bold text-xs">G</div>
        <div>
          <div className="font-bold text-sm text-[#1B2B5E] leading-tight">glow.naturals</div>
          <div className="text-[11px] text-gray-500">Sponsored post</div>
        </div>
      </div>
      {/* Image Area */}
      <div className="h-40 relative bg-gradient-to-br from-[#f2e7db] to-[#d8e3d0] overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-700/20 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-[#E07B00]" />
        
        {/* Bottle Mock */}
        <div className="absolute right-6 bottom-4 w-12 h-24 bg-[#23317c] rounded-t-lg rounded-b-md transform rotate-3 shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/90 rounded-sm" />
        </div>
        
        {/* Highlight 1 */}
        <div className="absolute top-6 left-12 right-20">
          <div className="text-[8px] font-black tracking-widest text-[#a66a38] uppercase mb-1">Acne Serum</div>
          <div className="border-2 border-dashed border-[#DC2626] bg-[#DC2626]/10 p-1.5 rounded text-center relative z-10">
            <span className="font-bold text-[#1B2B5E] text-[13px] leading-tight block">Guaranteed to cure acne</span>
            <span className="font-bold text-[#1B2B5E] text-[13px] leading-tight block">in 7 days</span>
          </div>
          <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#DC2626] border-2 border-white text-white flex items-center justify-center text-xs font-bold shadow-sm z-20">1</div>
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 flex items-start gap-3 bg-white relative">
        <div className="w-6 h-6 rounded-full bg-[#E07B00] border-2 border-white text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">2</div>
        <div className="text-xs font-medium text-[#1B2B5E] leading-snug">
          <span className="border border-dashed border-[#DC2626] text-[#DC2626] bg-[#DC2626]/10 px-1 py-0.5 rounded mr-1 font-bold">#ad?</span>
          Loving my new routine! Link in bio.
        </div>
      </div>
    </div>
  );
}

function Slide2Graphic() {
  return (
    <div className="w-80 bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col p-6 mb-10 transform rotate-1">
      <div className="mb-4">
        <span className="inline-block px-2.5 py-1 bg-[#E8E9FA] text-[#4F5594] rounded-md text-[10px] font-bold tracking-wider">ASCI-H-1</span>
      </div>
      <p className="text-sm font-medium text-[#1B2B5E] leading-relaxed mb-6">
        All health claims must be backed by <span className="bg-[#fde9cc] px-1 rounded">clinical</span> evidence. Guarantees of cure are generally prohibited.
      </p>
      <div className="pt-4 border-t border-gray-100 border-dashed">
        <p className="text-xs font-bold text-[#4F5594]">Health Claims Verification</p>
      </div>
    </div>
  );
}

function Slide3Graphic() {
  return (
    <div className="w-80 bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col mb-10">
      {/* Old Claim (faded/crossed out style) */}
      <div className="bg-[#fcf3f3] p-4 border-b border-[#f3dada]">
        <p className="text-xs font-bold text-[#b54b4b] line-through">Guaranteed to cure acne in 7 days</p>
      </div>
      {/* New Claim */}
      <div className="bg-[#f0f8f1] p-4 border-b border-[#d8ecd9]">
        <p className="text-sm font-bold text-[#14532d] leading-snug">Helps reduce acne within 7 days based on clinical studies.</p>
      </div>
      {/* Action Footer */}
      <div className="p-4 flex items-center justify-between bg-white">
        <span className="text-sm font-bold text-[#1B2B5E]">Mark as done</span>
        <div className="px-3 py-1.5 bg-[#f0f8f1] border border-[#138808] text-[#138808] rounded-full flex items-center gap-1.5 font-bold text-xs">
          <Check className="w-3.5 h-3.5" />
          Done
        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  {
    Graphic: Slide1Graphic,
    title: 'Catch risky claims',
    subtitle: 'Add your video, photo and caption. We flag absolute claims and missing disclosures so you fix them before launch.',
  },
  {
    Graphic: Slide2Graphic,
    title: 'Cite the exact rule',
    subtitle: 'Every issue comes with the rule behind it, so you always know why.',
  },
  {
    Graphic: Slide3Graphic,
    title: 'Fix it in one click',
    subtitle: 'Copy the suggested wording, tick it off, and watch your risk score drop.',
  }
];


export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  const [role, setRole] = useState('Agency'); // for signup

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const SlideGraphic = SLIDES[currentSlide].Graphic;

  return (
    <PageWrapper noPadding>
      <div className="min-h-screen flex w-full font-sans bg-white">
        
        {/* Left Column: Auth Form */}
        <div className="w-full lg:w-[50%] flex flex-col relative bg-[#F8F9FB] border-r border-gray-200">
          
          {/* Custom Darker Grid Background */}
          <div 
            className="absolute inset-0 z-0 opacity-100" 
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} 
          />
          
          {/* Logo Header */}
          <div className="relative z-10 p-6 sm:px-10 sm:py-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#E07B00]" />
              <span className="font-bold text-xl font-display text-[#1B2B5E]">
                AdCheck <span className="text-[#E07B00]">India</span>
              </span>
            </Link>
          </div>

          {/* Form Container */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-16 md:px-24 pb-8 max-w-[600px] mx-auto w-full">
            
            {/* Toggle Log in / Sign up */}
            <div className="bg-[#F0F2F9] p-1.5 rounded-2xl flex mb-8">
              <button 
                onClick={() => setMode('login')} 
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  mode === 'login' 
                  ? 'bg-white shadow text-[#1B2B5E]' 
                  : 'text-[#4F5A80] hover:text-[#1B2B5E]'
                }`}
              >
                Log in
              </button>
              <button 
                onClick={() => setMode('signup')} 
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  mode === 'signup' 
                  ? 'bg-white shadow text-[#1B2B5E]' 
                  : 'text-[#4F5A80] hover:text-[#1B2B5E]'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Title & Underline */}
            <h1 className="text-3xl sm:text-4xl font-black font-display text-[#1B2B5E] mb-4">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <div className="flex gap-1 mb-6">
              <div className="w-8 h-1.5 bg-[#E07B00] rounded-full" />
              <div className="w-8 h-1.5 bg-gray-200 rounded-full" />
              <div className="w-8 h-1.5 bg-[#138808] rounded-full" />
            </div>
            <p className="text-gray-600 font-medium text-[15px] mb-8">
              {mode === 'login' 
                ? 'Log in to see your reports and run a new check.' 
                : 'Check your first ad for free. No card needed.'}
            </p>

            {/* Google Button */}
            <button className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm font-bold text-[#1B2B5E] text-[15px]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-4 text-xs font-bold text-gray-400">or with email</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Form Fields */}
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              {mode === 'signup' && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Full name" 
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#E07B00] transition-colors"
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#E07B00] transition-colors"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#E07B00] transition-colors"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Extras based on mode */}
              {mode === 'login' && (
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-[#439650] border-transparent text-white shadow-sm">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold text-[#1B2B5E]">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-bold text-[#1B2B5E] underline underline-offset-4 decoration-gray-300 hover:decoration-[#1B2B5E] transition-colors">
                    Forgot password?
                  </a>
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-6 pt-2">
                  {/* Password Strength */}
                  <div className="space-y-2">
                    <div className="flex gap-1.5">
                      <div className="h-1 flex-1 bg-[#E07B00] rounded-full" />
                      <div className="h-1 flex-1 bg-gray-200 rounded-full" />
                      <div className="h-1 flex-1 bg-gray-200 rounded-full" />
                      <div className="h-1 flex-1 bg-gray-200 rounded-full" />
                    </div>
                    <p className="text-xs font-bold text-[#4F5A80]">Use 8+ characters</p>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black tracking-widest text-[#4F5A80] uppercase">I am a</p>
                    <div className="flex flex-wrap gap-2">
                      {['Agency', 'D2C brand', 'Influencer manager', 'Creator'].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                            role === r 
                            ? 'border-[#1B2B5E] text-[#1B2B5E] shadow-[3px_3px_0_#E07B00] bg-white' 
                            : 'border-gray-200 text-[#4F5A80] bg-white hover:border-gray-300'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group pt-2">
                    <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center bg-white mt-0.5 shrink-0 group-hover:border-gray-400 transition-colors">
                    </div>
                    <span className="text-[13px] font-bold text-[#1B2B5E] leading-snug">
                      I agree to the Terms and Privacy Policy
                    </span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="button" 
                onClick={() => navigate('/')} // Mock navigation
                className="w-full py-4 mt-6 bg-[#E07B00] hover:bg-[#c76d00] text-white rounded-xl text-[15px] font-bold shadow-[0_6px_20px_rgba(224,123,0,0.3)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {mode === 'login' ? 'Log in' : 'Create account'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer Link */}
            <p className="text-center mt-8 text-sm font-medium text-gray-500">
              {mode === 'login' ? 'New here? ' : 'Already have an account? '}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="font-bold text-[#1B2B5E] underline underline-offset-4 decoration-gray-300 hover:decoration-[#1B2B5E] transition-colors"
              >
                {mode === 'login' ? 'Create an account' : 'Log in'}
              </button>
            </p>

          </div>
        </div>

        {/* Right Column: Visual Showcase */}
        <div className="hidden lg:flex w-[50%] bg-[#FFFcf9] flex-col items-center justify-center relative overflow-hidden">
          
          {/* Subtle Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,241,227,0.8)_0%,rgba(255,252,249,0)_70%)]" />

          {/* Animated Chakra Graphic */}
          <div 
            className="absolute -left-[45%] top-1/2 -translate-y-1/2 w-[850px] h-[850px] opacity-40"
            style={{ animation: 'spin 120s linear infinite' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#d4c8b8] stroke-current">
              {/* Outer rings */}
              <circle cx="50" cy="50" r="48" fill="none" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="45" fill="none" strokeWidth="0.5" />
              {/* Inner Hub */}
              <circle cx="50" cy="50" r="6" fill="none" strokeWidth="1" />
              {/* 24 Spokes */}
              {Array.from({ length: 24 }).map((_, i) => (
                <line 
                  key={i} 
                  x1="50" 
                  y1="44" 
                  x2="50" 
                  y2="5" 
                  strokeWidth="0.4"
                  transform={`rotate(${i * 15} 50 50)`} 
                />
              ))}
            </svg>
          </div>
          
          <style>{`
            @keyframes spin {
              from { transform: translateY(-50%) rotate(0deg); }
              to { transform: translateY(-50%) rotate(360deg); }
            }
          `}</style>

          {/* Carousel Content */}
          <div className="relative z-10 flex flex-col items-center">
            
            <div className="min-h-[260px] flex items-center justify-center">
               <SlideGraphic />
            </div>

            <div className="text-center max-w-sm mt-8">
              <h2 className="text-3xl font-black font-display text-[#1B2B5E] mb-4">
                {SLIDES[currentSlide].title}
              </h2>
              <p className="text-[#4F5A80] leading-relaxed text-[15px]">
                {SLIDES[currentSlide].subtitle}
              </p>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-3 mt-12">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSlide 
                    ? 'w-8 bg-[#E07B00]' 
                    : 'w-6 bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
