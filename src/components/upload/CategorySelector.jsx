import { AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../../lib/constants';
import CategoryChip from '../common/CategoryChip';

export default function CategorySelector({ value, onChange, error }) {
  return (
    <div className="w-full">
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${error ? 'animate-[shake_0.5s]' : ''}`}>
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat.id}
            category={cat}
            selected={value === cat.id}
            onClick={() => onChange(cat.id)}
          />
        ))}
      </div>
      {error && (
        <div className="mt-3 text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </div>
      )}
    </div>
  );
}
