import React from 'react';
import { NotificationItem, NotificationSettings } from '../types';
import { X, Bell, Mail, Smartphone, Check, Clock, AlertTriangle, Tag, RefreshCcw } from 'lucide-react';

interface NotificationSettingsModalProps {
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const toggle = (key: keyof NotificationSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-600" />
            <h3 className="font-extrabold text-stone-900 text-base">
              Configurar Notificaciones (CU-11)
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Main Channels (Req 10.1, 10.2) */}
          <div className="space-y-3">
            <span className="font-bold text-stone-500 uppercase tracking-wider block text-[11px]">
              Canales de Envío
            </span>

            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-sky-600" />
                <div>
                  <strong className="text-stone-900 block font-semibold">Notificaciones Push (Móvil/Web)</strong>
                  <span className="text-[11px] text-stone-500">Alertas instantáneas en dispositivo</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.pushEnabled}
                onChange={() => toggle('pushEnabled')}
                className="w-4 h-4 accent-sky-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-600" />
                <div>
                  <strong className="text-stone-900 block font-semibold">Correos Electrónicos</strong>
                  <span className="text-[11px] text-stone-500">Envío de confirmaciones y comprobantes PDF</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={() => toggle('emailEnabled')}
                className="w-4 h-4 accent-sky-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Event Categories (Req 10.6) */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <span className="font-bold text-stone-500 uppercase tracking-wider block text-[11px]">
              Tipos de Alertas Personalizadas
            </span>

            {/* Schedule Changes (Req 10.3) */}
            <div className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl transition-colors">
              <div>
                <span className="font-semibold text-stone-900 block">Cambios de Horario de Vuelo (Req 10.3)</span>
                <span className="text-[11px] text-stone-500">Avisos urgentes por reprogramaciones o demoras</span>
              </div>
              <input
                type="checkbox"
                checked={settings.flightScheduleChanges}
                onChange={() => toggle('flightScheduleChanges')}
                className="w-4 h-4 accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Promotions & Offers (Req 10.4) */}
            <div className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl transition-colors">
              <div>
                <span className="font-semibold text-stone-900 block">Nuevas Ofertas y Promociones (Req 10.4)</span>
                <span className="text-[11px] text-stone-500">Descuentos de temporada en el Mercosur</span>
              </div>
              <input
                type="checkbox"
                checked={settings.promotionsAndOffers}
                onChange={() => toggle('promotionsAndOffers')}
                className="w-4 h-4 accent-sky-600 cursor-pointer"
              />
            </div>

            {/* 24h Payment Reminder (Req 10.5) */}
            <div className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl transition-colors">
              <div>
                <span className="font-semibold text-stone-900 block">Recordatorio Plazo 24hs de Pago (Req 10.5)</span>
                <span className="text-[11px] text-stone-500">Aviso previo a que expire la reserva</span>
              </div>
              <input
                type="checkbox"
                checked={settings.payment24hReminder}
                onChange={() => toggle('payment24hReminder')}
                className="w-4 h-4 accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Refund & Cancellations (Req 6.7) */}
            <div className="flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-xl transition-colors">
              <div>
                <span className="font-semibold text-stone-900 block">Estado de Reembolsos y Cancelaciones (Req 6.7)</span>
                <span className="text-[11px] text-stone-500">Notificación del resultado de la solicitud</span>
              </div>
              <input
                type="checkbox"
                checked={settings.refundAndCancellations}
                onChange={() => toggle('refundAndCancellations')}
                className="w-4 h-4 accent-sky-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Guardar Preferencias
          </button>
        </div>
      </div>
    </div>
  );
};

interface NotificationCenterModalProps {
  notifications: NotificationItem[];
  onClear: () => void;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  notifications,
  onClear,
  onClose,
  onOpenSettings,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-sky-600" />
            <h3 className="font-extrabold text-stone-900 text-base">
              Buzón de Notificaciones del Sistema (CU-16)
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs">
              No tenés notificaciones pendientes.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs space-y-1 hover:bg-stone-100/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    {n.channel === 'push' ? (
                      <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                    ) : (
                      <Mail className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>{n.title}</span>
                  </span>
                  <span className="text-[10px] text-stone-400">{n.timestamp}</span>
                </div>
                <p className="text-stone-600 leading-relaxed text-[11px]">{n.message}</p>
                {n.relatedReservationCode && (
                  <span className="inline-block text-[10px] font-mono text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded">
                    Reserva #{n.relatedReservationCode}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
          <button
            onClick={onOpenSettings}
            className="text-sky-700 hover:text-sky-900 font-semibold underline"
          >
            Configurar Tipos de Notificaciones (CU-11)
          </button>

          {notifications.length > 0 && (
            <button
              onClick={onClear}
              className="text-stone-500 hover:text-rose-600 font-medium"
            >
              Limpiar Todo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
