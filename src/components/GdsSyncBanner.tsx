import React, { useState } from 'react';
import { RefreshCw, Radio, CheckCircle2 } from 'lucide-react';

interface GdsSyncBannerProps {
  onSyncTrigger: () => void;
  isSyncing: boolean;
  lastSyncTime: string;
}

export const GdsSyncBanner: React.FC<GdsSyncBannerProps> = ({
  onSyncTrigger,
  isSyncing,
  lastSyncTime,
}) => {
  return (
    <div className="bg-stone-900 text-stone-300 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-stone-800">
      <div className="flex items-center gap-2">
        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span className="font-semibold text-stone-200">
          CU-17 GDS &amp; Provider Gateway:
        </span>
        <span className="text-stone-400 hidden sm:inline">
          Conexión activa con GDS Amadeus/Sabre Mercosur y APIs de aerolíneas/hotelería (Req 12.1, 12.2)
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-stone-400">
          Última sincronización: <strong>{lastSyncTime}</strong>
        </span>
        <button
          id="btn-sync-gds"
          onClick={onSyncTrigger}
          disabled={isSyncing}
          className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors border border-stone-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 text-sky-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Sincronizando GDS...' : 'Sincronizar en Tiempo Real'}</span>
        </button>
      </div>
    </div>
  );
};
