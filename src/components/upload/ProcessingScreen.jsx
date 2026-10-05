import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, Check } from 'lucide-react';

const STEPS = [
  'Reading media',
  'Detecting claims',
  'Verifying proof',
  'Checking rules',
  'Preparing report'
];

export default function ProcessingScreen({ onCancel, completedReportId }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  // Smoothly increment progress over time if not complete
  useEffect(() => {
    if (completedReportId) {
      setProgress(100);
      return;
    }

    // Advance roughly to 95% over 8 seconds. 
    // 8 seconds = 8000ms. We update every 100ms.
    // 80 ticks to reach ~95%. So about 1.2% per tick.
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + 1.2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [completedReportId]);

  const isComplete = !!completedReportId;
  const displayProgress = Math.min(Math.floor(progress), 100);
  
  // Figure out current step based on progress percentage
  // 0-20% = step 0, 20-40% = step 1, 40-60% = step 2, 60-80% = step 3, 80-100% = step 4
  const currentStepIndex = isComplete ? 5 : Math.min(Math.floor(displayProgress / 20), 4);

  return (
    <div className="w-full max-w-[800px] mx-auto py-4">
      {/* Outer Card */}
      <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {!isComplete ? (
              <div className="w-8 h-8 rounded-full border-[3px] border-gray-100 border-t-[#E07B00] animate-spin" />
            ) : null}
            <div>
              <h2 className="text-xl font-bold text-[#1B2B5E]">
                {isComplete ? 'Analysis complete' : `${STEPS[currentStepIndex]}...`}
              </h2>
              <p className="text-[15px] text-gray-500 mt-0.5">Usually under 60 seconds</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1B2B5E]">
            {displayProgress}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ease-out ${isComplete ? 'bg-[#138808]' : 'bg-[#E07B00]'}`}
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Steps Grid */}
        <div className="flex flex-wrap gap-3 mb-8">
          {STEPS.map((stepName, idx) => {
            const isDone = idx < currentStepIndex || isComplete;
            const isActive = idx === currentStepIndex && !isComplete;
            
            // Determine styles for the pill
            let pillClass = "flex items-center gap-2.5 px-4 py-2 rounded-full border transition-colors ";
            let iconNode = null;
            let textClass = "font-bold text-sm ";

            if (isDone) {
              pillClass += "border-gray-200 bg-white";
              textClass += "text-[#1B2B5E]";
              iconNode = (
                <div className="w-6 h-6 rounded-full bg-[#138808] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
              );
            } else if (isActive) {
              pillClass += "border-[#E07B00] bg-[#FFF9F0]";
              textClass += "text-[#1B2B5E]";
              iconNode = (
                <div className="w-6 h-6 rounded-full bg-[#FFF0DB] border border-[#E07B00] flex items-center justify-center shrink-0 text-[#E07B00] font-bold text-xs">
                  {idx + 1}
                </div>
              );
            } else {
              pillClass += "border-gray-200 bg-white";
              textClass += "text-[#64748B]";
              iconNode = (
                <div className="w-6 h-6 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0 font-bold text-xs">
                  {idx + 1}
                </div>
              );
            }

            return (
              <div key={idx} className={pillClass}>
                {iconNode}
                <span className={textClass}>{stepName}</span>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-4">
          {!isComplete ? (
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Cancel analysis
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate(`/results/${completedReportId}`)}
                className="px-8 py-3 rounded-xl bg-[#E07B00] text-white font-bold shadow-[0_4px_12px_rgba(224,123,0,0.3)] hover:bg-[#c76d00] transition-colors"
              >
                View report
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Run demo again
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
