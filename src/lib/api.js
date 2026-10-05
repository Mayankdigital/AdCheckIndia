import { createMockReport } from './mockData.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Analyze an ad.
 * @param {{ video?: File, photo?: File, category: string, isInfluencer: boolean, caption?: string }} params
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<import('./types.js').AnalysisReport>}
 */
export async function analyzeAd(params, options = {}) {
  if (USE_MOCK) {
    return mockAnalyzeAd(params, options);
  }
  return realAnalyzeAd(params, options);
}

async function mockAnalyzeAd({ category, isInfluencer }, { signal } = {}) {
  const delay = 6000 + Math.random() * 2000;
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, delay);
    signal?.addEventListener('abort', () => { clearTimeout(timeout); reject(new DOMException('Aborted', 'AbortError')); });
  });
  return createMockReport(category, isInfluencer);
}

async function realAnalyzeAd({ video, photo, category, isInfluencer, caption }, { signal } = {}) {
  const formData = new FormData();
  if (video) formData.append('video', video);
  if (photo) formData.append('photo', photo);
  formData.append('category', category);
  formData.append('isInfluencer', String(isInfluencer));
  if (caption) formData.append('caption', caption);
  
  const res = await fetch(`${API_URL}/analyze`, { method: 'POST', body: formData, signal });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
