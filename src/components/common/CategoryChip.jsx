import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function CategoryChip({ category, selected, onClick }) {
  const Icon = Icons[category.icon] || Icons.HelpCircle;

  return (
    <button
      type="button"
      onClick={() => onClick(category.id)}
      className={`relative flex flex-row items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200 w-full outline-none ${
        selected 
          ? 'bg-[#FFF9F0] border-[2px] border-[#1B2B5E] shadow-[3px_3px_0_#E07B00]' 
          : 'bg-white border-[1px] border-gray-200 hover:border-gray-300 shadow-sm'
      }`}
    >
      <Icon className={`w-5 h-5 shrink-0 ${selected ? 'text-[#1B2B5E]' : 'text-gray-500'}`} />
      <span className={`text-[15px] font-bold ${selected ? 'text-[#1B2B5E]' : 'text-gray-600'}`}>
        {category.label}
      </span>
    </button>
  );
}
