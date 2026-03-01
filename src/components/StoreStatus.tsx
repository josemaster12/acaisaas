import { Clock } from 'lucide-react';
import { storeConfig } from '@/data/store';

export function StoreStatus() {
  const now = new Date();
  const currentHour = now.getHours();
  const isOpen = currentHour >= storeConfig.openHour && currentHour < storeConfig.closeHour;

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card shadow-card">
      <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      <span className="font-medium text-sm">
        {isOpen ? 'Aberto agora' : 'Fechado'}
      </span>
      <div className="flex items-center gap-1 text-muted-foreground text-sm">
        <Clock className="w-4 h-4" />
        <span>{storeConfig.openHour}h - {storeConfig.closeHour}h</span>
      </div>
    </div>
  );
}
