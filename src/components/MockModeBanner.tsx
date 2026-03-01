import { useEffect, useState } from 'react';
import { X, Beaker } from 'lucide-react';
import { DEVELOPMENT_CONFIG } from '@/config';

export function MockModeBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se já foi fechado na sessão atual
    const hasBeenClosed = sessionStorage.getItem('mockBannerClosed');
    
    if (DEVELOPMENT_CONFIG.USE_MOCK_API && !hasBeenClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('mockBannerClosed', 'true');
  };

  if (!isVisible || !DEVELOPMENT_CONFIG.USE_MOCK_API) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 text-sm flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <Beaker className="h-4 w-4" />
        <span className="font-medium">{DEVELOPMENT_CONFIG.MOCK_MESSAGE}</span>
      </div>
      <button
        onClick={handleClose}
        className="hover:bg-amber-600 rounded p-1 transition-colors"
        aria-label="Fechar banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
