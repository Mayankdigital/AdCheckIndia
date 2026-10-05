import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { AlertCircle, Upload } from 'lucide-react';

import PageWrapper from '../components/layout/PageWrapper';
import VideoDropzone from '../components/upload/VideoDropzone';
import PhotoDropzone from '../components/upload/PhotoDropzone';
import CategorySelector from '../components/upload/CategorySelector';
import InfluencerToggle from '../components/upload/InfluencerToggle';
import ProcessingScreen from '../components/upload/ProcessingScreen';

import { useFileStore } from '../context/FileStoreContext';
import { analyzeAd } from '../lib/api';
import { useHistory } from '../hooks/useHistory';

const schema = z.object({
  video: z.any().optional(),
  photo: z.any().optional(),
  category: z.string({ required_error: "Please select a category" }).min(1, "Please select a category"),
  isInfluencer: z.boolean(),
  caption: z.string().optional()
}).refine(data => data.video || data.photo, {
  message: "Either a video or photo is required",
  path: ["video"]
});

export default function CheckPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedReportId, setCompletedReportId] = useState(null);
  const abortControllerRef = useRef(null);
  
  const navigate = useNavigate();
  const { files, clearFiles } = useFileStore();
  const { addReport } = useHistory();

  const { control, handleSubmit, formState: { errors }, watch, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      video: files.video || null,
      photo: files.photo || null,
      category: '',
      isInfluencer: false,
      caption: ''
    }
  });

  const category = watch('category');
  const videoFile = watch('video');
  const photoFile = watch('photo');

  const onSubmit = async (data) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsProcessing(true);
    setErrorMsg('');
    setCompletedReportId(null);
    abortControllerRef.current = new AbortController();

    try {
      const report = await analyzeAd(
        {
          video: data.video,
          photo: data.photo,
          category: data.category,
          isInfluencer: data.isInfluencer,
          caption: data.caption
        },
        { signal: abortControllerRef.current.signal }
      );
      
      addReport(report);
      setCompletedReportId(report.id);
    } catch (err) {
      if (err.name === 'AbortError') {
        toast('Analysis cancelled', { icon: '🛑' });
      } else {
        setErrorMsg(err.message || 'An error occurred during analysis.');
        toast.error('Analysis failed');
      }
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const isFormValid = (videoFile || photoFile) && category;

  return (
    <PageWrapper>
      <div className="absolute inset-0 bg-[#F8F9FB] -z-10 bg-grid-india" />
      
      <div className="max-w-[1000px] mx-auto w-full px-4 sm:px-6 py-12 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 text-[#1B2B5E]">Check your ad</h1>
          <div className="flex justify-center gap-2 mb-6">
            <div className="h-1 w-8 bg-[#E07B00] rounded-full" />
            <div className="h-1 w-8 bg-gray-200 rounded-full" />
            <div className="h-1 w-8 bg-[#138808] rounded-full" />
          </div>
          <p className="text-lg text-gray-500">Upload your media, add proof for your claims, and let our AI handle the compliance check.</p>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden">
          {isProcessing ? (
            <div className="p-4 sm:p-10">
              <ProcessingScreen onCancel={handleCancel} completedReportId={completedReportId} />
            </div>
          ) : errorMsg ? (
            <div className="text-center py-20 px-10">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-[#1B2B5E]">Analysis Failed</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">{errorMsg}</p>
              <button 
                onClick={() => setErrorMsg('')}
                className="px-6 py-2 rounded-full bg-gray-100 font-bold hover:bg-gray-200 transition-colors text-[#1B2B5E]"
              >
                Try Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 pt-6 pb-32 sm:px-8 sm:pt-8 sm:pb-36 md:px-12 md:pt-12 md:pb-48 space-y-12">
                
                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#1B2B5E] text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                    <h2 className="text-xl font-bold text-[#1B2B5E]">Upload media <span className="text-[#E07B00]">*</span></h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-0 md:ml-12">
                    <Controller
                      name="video"
                      control={control}
                      render={({ field }) => (
                        <VideoDropzone error={errors.video} onChange={field.onChange} value={field.value} />
                      )}
                    />
                    <Controller
                      name="photo"
                      control={control}
                      render={({ field }) => (
                        <PhotoDropzone error={errors.photo} onChange={field.onChange} value={field.value} />
                      )}
                    />
                  </div>
                  {errors.video && !errors.photo && (
                    <p className="text-sm text-red-500 mt-3 md:ml-12">{errors.video.message}</p>
                  )}
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#1B2B5E] text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                    <h2 className="text-xl font-bold text-[#1B2B5E]">Select category <span className="text-[#E07B00]">*</span></h2>
                  </div>
                  <div className="ml-0 md:ml-12">
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <CategorySelector value={field.value} onChange={field.onChange} error={errors.category} />
                      )}
                    />
                  </div>
                </div>

                {/* Step 3 */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#1B2B5E] text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                    <h2 className="text-xl font-bold text-[#1B2B5E]">Supporting documents <span className="ml-2 px-3 py-1 bg-[#F1F5F9] text-[#64748B] text-[13px] font-semibold rounded-full align-middle">Optional</span></h2>
                  </div>
                  <div className="ml-0 md:ml-12">
                    <p className="text-gray-600 mb-5 text-[15px] leading-relaxed">
                      Claiming a lab test result, a certification, or a clinical study? Add the proof so we can check it against your ad. It is optional, but it helps us verify your claims.
                    </p>
                    <div className="inline-block px-5 py-2.5 bg-[#FFF4E5] text-[#E07B00] text-sm font-bold rounded-full mb-6">
                      Pick a category to see the proof we usually look for.
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-[#1B2B5E] mb-2">Document type</label>
                        <select className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#1B2B5E] text-gray-700 bg-white font-medium">
                          <option>Lab test report</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#1B2B5E] mb-2">Which claim does it support? <span className="text-gray-400 font-normal">(optional)</span></label>
                        <input type="text" placeholder="e.g. Dermatologically tested" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#1B2B5E] text-gray-700 font-medium placeholder-gray-400" />
                      </div>
                    </div>

                    <div className="border-[1.5px] border-dashed border-[#A5B4CB] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-center bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="font-bold text-[#1B2B5E]">Drop documents here or click to upload</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">PDF, JPG, PNG up to 10MB each, up to 5 files</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#1B2B5E] text-white flex items-center justify-center font-bold text-sm shrink-0">4</div>
                    <h2 className="text-xl font-bold text-[#1B2B5E]">Additional context</h2>
                  </div>
                  <div className="ml-0 md:ml-12 border border-gray-200 rounded-2xl p-6">
                    <Controller
                      name="isInfluencer"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-[#1B2B5E] text-lg">Influencer check</h3>
                            <p className="text-[15px] text-gray-500 mt-1">Enable specific guidelines for influencer posts</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => field.onChange(!field.value)}
                            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${field.value ? 'bg-[#1B2B5E]' : 'bg-[#CBD5E1]'}`}
                          >
                            <div className={`bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform ${field.value ? 'translate-x-6' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>

              </div>

              {/* Sticky Footer */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 z-20">
                <div className="text-sm font-medium text-gray-500">
                  {videoFile ? 'Video uploaded' : 'Video -'} · {photoFile ? 'Image uploaded' : 'Image -'} · {category ? 'Category selected' : 'No category'} · 0 proof files
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      clearFiles();
                      reset();
                      window.location.reload();
                    }}
                    className="font-bold text-[#1B2B5E] hover:text-gray-600 transition-colors ml-auto md:ml-0"
                  >
                    Clear all
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid || isProcessing}
                    className={`px-8 py-3 rounded-xl font-bold transition-all ${
                      isFormValid 
                        ? 'bg-[#F6DAB4] text-[#C28C46] hover:bg-[#f2cd9d]' 
                        : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                    }`}
                  >
                    Start analysis
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
    
