import { useLocalStorage } from './useLocalStorage';
import { HISTORY_KEY } from '../lib/constants';

export function useHistory() {
  const [history, setHistory] = useLocalStorage(HISTORY_KEY, []);

  const addReport = (report) => {
    setHistory(prev => [report, ...prev]);
  };

  const removeReport = (id) => {
    setHistory(prev => prev.filter(r => r.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return { history, addReport, removeReport, clearHistory };
}
