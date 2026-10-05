import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { FileStoreProvider } from './context/FileStoreContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgressBar from './components/common/ScrollProgressBar';
// import LoadingSkeleton from './components/common/LoadingSkeleton';

const HomePage = lazy(() => import('./pages/HomePage'));
const CheckPage = lazy(() => import('./pages/CheckPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Suspense fallback={<PageLoading />}><HomePage /></Suspense>} />
        <Route path="/check" element={<Suspense fallback={<PageLoading />}><CheckPage /></Suspense>} />
        <Route path="/results/:id" element={<Suspense fallback={<PageLoading />}><ResultsPage /></Suspense>} />
        <Route path="/history" element={<Suspense fallback={<PageLoading />}><HistoryPage /></Suspense>} />
        <Route path="/auth" element={<Suspense fallback={<PageLoading />}><AuthPage /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<PageLoading />}><NotFoundPage /></Suspense>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageLoading() {
  return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
}

function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideNavFooter = location.pathname.startsWith('/results') || location.pathname.startsWith('/auth');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <ScrollProgressBar />
      {!hideNavFooter && <Navbar />}
      <main className="flex-1 flex flex-col min-h-screen">
        {children}
      </main>
      {!hideNavFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FileStoreProvider>
        <BrowserRouter>
          <LayoutWrapper>
            <AnimatedRoutes />
          </LayoutWrapper>
          <Toaster position="top-right" toastOptions={{ style: { background: '#1B2B5E', color: '#fff', border: '1px solid rgba(27,43,94,0.3)' } }} />
        </BrowserRouter>
      </FileStoreProvider>
    </ThemeProvider>
  );
}
