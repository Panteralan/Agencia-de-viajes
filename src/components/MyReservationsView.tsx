import React, { useEffect, useState } from 'react';
import { Currency, Language, Reservation } from '../types';
import { getTimeRemaining24h } from '../utils/helpers';
import { formatPrice } from '../data/mockData';
import { getTranslation } from '../utils/translations';
import { 
  Ticket, 
  Clock, 
  CreditCard, 
  XCircle, 
  FileText, 
  Edit3, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle,
  QrCode,
  Plane,
  Bus,
  ArrowLeft
} from 'lucide-react';

interface MyReservationsViewProps {
  reservations: Reservation[];
  currency: Currency;
  language: Language;
  onPayReservation: (res: Reservation) => void;
  onCancelUnpaidReservation: (resId: string) => void;
  onOpenRefundModal: (res: Reservation) => void;
  onOpenModifyModal: (res: Reservation) => void;
  onOpenVoucher: (res: Reservation) => void;
  onBackToSearch: () => void;
}

export const MyReservationsView: React.FC<MyReservationsViewProps> = ({
  reservations,
  currency,
  language,
  onPayReservation,
  onCancelUnpaidReservation,
  onOpenRefundModal,
  onOpenModifyModal,
  onOpenVoucher,
  onBackToSearch,
}) => {
  const t = getTranslation(language);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [, setTick] = useState(0);

  // Live timer tick every second for real-time 24h countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredReservations = reservations.filter((r) => {
    if (filter === 'pending') return r.status === 'pending_payment';
    if (filter === 'confirmed') return r.status === 'confirmed_paid' || r.status === 'modified';
    if (filter === 'cancelled') return r.status === 'cancelled' || r.status === 'refund_requested' || r.status === 'refunded';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <button
            onClick={onBackToSearch}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Búsqueda de Destinos</span>
          </button>
          <div className="flex items-center gap-2">
            <Ticket className="w-6 h-6 text-sky-600" />
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              {t.myReservations}
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gestioná tus vuelos y paquetes turísticos en el Mercosur, completá pagos antes de las 24hs o solicitá cambios.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Todas ({reservations.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              filter === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Pendientes (24hs)</span>
            <span className="text-[10px] bg-white/20 px-1.5 rounded-full">
              {reservations.filter((r) => r.status === 'pending_payment').length}
            </span>
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'confirmed' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pagadas
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'cancelled' ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Canceladas / Reembolsos
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredReservations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
          <Ticket className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">No hay reservas en esta categoría</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Explorá los destinos disponibles en el Mercosur y creá tu primera reserva para bloquear los asientos durante 24 horas.
          </p>
          <button
            onClick={onBackToSearch}
            className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Explorar Vuelos y Paquetes
          </button>
        </div>
      )}

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.map((res) => {
          const isPending = res.status === 'pending_payment';
          const isPaid = res.status === 'confirmed_paid' || res.status === 'modified';
          const isRefundRequested = res.status === 'refund_requested';
          const isRefunded = res.status === 'refunded';
          const isCancelled = res.status === 'cancelled';
          const countdown = getTimeRemaining24h(res.paymentDeadline);

          return (
            <div
              key={res.id}
              className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                isPending
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : isPaid
                  ? 'border-emerald-200'
                  : 'border-stone-200 opacity-90'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Info */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-sm text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                      #{res.bookingCode}
                    </span>

                    {/* Status badge */}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pendiente de Pago (Plazo 24hs)</span>
                      </span>
                    )}

                    {isPaid && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmada y Pagada</span>
                      </span>
                    )}

                    {isRefundRequested && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        <RefreshCcw className="w-3.5 h-3.5" />
                        <span>Solicitud de Reembolso en Evaluación</span>
                      </span>
                    )}

                    {isRefunded && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Compra Cancelada y Reembolsada</span>
                      </span>
                    )}

                    {isCancelled && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reserva Cancelada sin Cargo</span>
                      </span>
                    )}

                    <span className="text-[11px] text-stone-400">
                      Creada: {new Date(res.createdAt).toLocaleDateString('es-AR')}
                    </span>
                  </div>

                  {/* Destination and Transport Details */}
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-stone-900 flex items-center gap-2">
                      {res.packageSnapshot.transportType === 'flight' ? (
                        <Plane className="w-4 h-4 text-sky-600" />
                      ) : (
                        <Bus className="w-4 h-4 text-amber-600" />
                      )}
                      <span>{res.packageSnapshot.title}</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-1">
                      <span>Ruta: <strong>{res.packageSnapshot.originCity} → {res.packageSnapshot.destinationCity}</strong></span>
                      <span>•</span>
                      <span>Fecha: <strong>{res.travelDate} ({res.travelTime} hs)</strong></span>
                      <span>•</span>
                      <span>Asientos: <strong className="font-mono text-sky-700">{res.seatCodes.join(', ')}</strong></span>
                      <span>•</span>
                      <span>Pasajeros: <strong>{res.passengers.length} ({res.passengers.map((p) => p.fullName).join(', ')})</strong></span>
                    </div>
                  </div>

                  {/* 24-HOUR COUNTDOWN BANNER (Req 2.5) */}
                  {isPending && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                        <span className="text-amber-900 font-semibold">
                          {t.hoursRemaining}
                        </span>
                        <span className="font-mono font-black text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded text-sm tracking-wider">
                          {countdown.formatted}
                        </span>
                      </div>
                      <span className="text-[11px] text-amber-800">
                        Vence el: {new Date(res.paymentDeadline).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                      </span>
                    </div>
                  )}

                  {/* Refund request detail summary if present */}
                  {res.refundRequest && (
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
                      <div className="flex items-center justify-between">
                        <strong>Motivo de reembolso declarado:</strong>
                        <span className="font-bold">{res.refundRequest.percentage}% aplicable</span>
                      </div>
                      <p className="text-[11px] italic">"{res.refundRequest.reason}"</p>
                      <p className="text-[10px] text-purple-700">
                        Estado: <span className="font-semibold uppercase">{res.refundRequest.status}</span> • Devolución estimada: {formatPrice(res.refundRequest.estimatedRefundUSD, currency)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Actions & Amount */}
                <div className="flex flex-col items-start lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Importe Total</span>
                    <span className="text-xl font-black text-stone-900">
                      {formatPrice(res.totalAmountUSD, currency)}
                    </span>
                    <span className="text-[10px] text-stone-500 block">({currency})</span>
                  </div>

                  {/* Contextual Action Buttons based on Use Cases */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* CU-06: Pagar Reserva */}
                    {isPending && !countdown.isExpired && (
                      <button
                        id={`btn-pay-${res.id}`}
                        onClick={() => onPayReservation(res)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pagar Ahora (CU-06)</span>
                      </button>
                    )}

                    {/* CU-07: Cancelar Reserva pendiente (sin costo) */}
                    {isPending && (
                      <button
                        id={`btn-cancel-unpaid-${res.id}`}
                        onClick={() => onCancelUnpaidReservation(res.id)}
                        className="px-3 py-2 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-stone-200"
                        title="Cancelar reserva y liberar asientos"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Cancelar (CU-07)</span>
                      </button>
                    )}

                    {/* CU-06: Ver / Imprimir Voucher PDF con QR */}
                    {isPaid && (
                      <button
                        id={`btn-voucher-${res.id}`}
                        onClick={() => onOpenVoucher(res)}
                        className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Voucher PDF + QR</span>
                      </button>
                    )}

                    {/* CU-09: Modificar Reserva */}
                    {isPaid && (
                      <button
                        id={`btn-modify-${res.id}`}
                        onClick={() => onOpenModifyModal(res)}
                        className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 border border-sky-200"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Modificar (CU-09)</span>
                      </button>
                    )}

                    {/* CU-08: Cancelar compra y solicitar reembolso */}
                    {isPaid && (
                      <button
                        id={`btn-refund-${res.id}`}
                        onClick={() => onOpenRefundModal(res)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 border border-rose-200"
                      >
                        <FileText className="w-3.5 h-3.5 text-rose-600" />
                        <span>Reembolso (CU-08)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
