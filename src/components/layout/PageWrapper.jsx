import { motion } from 'framer-motion';

export default function PageWrapper({ children, noPadding = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`min-h-screen flex flex-col ${noPadding ? '' : 'pt-16'}`}
    >
      {children}
    </motion.div>
  );
}
