import React, { useState } from 'react';
import { Currency, Reservation } from '../types';
import { calculateRefundEligibility } from '../utils/helpers';
import { formatPrice } from '../data/mockData';
import { X, AlertTriangle, CheckCircle2, ShieldAlert, FileText } from 'lucide-react';

interface CancelRefundModalProps {
  reservation: Reservation;
  currency: Currency;
  onClose: () => void;
  onConfirmRefund: (reservationId: string, reason: string, percentage: number, estimatedRefundUSD: number) => void;
}

export const CancelRefundModal: React.FC<CancelRefundModalProps> = ({
  reservation,
  currency,
  onClose,
  onConfirmRefund,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const eligibility = calculateRefundEligibility(reservation.travelDate);
  const estimatedRefundUSD = Math.round((reservation.totalAmountUSD * eligibility.percentage) / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mandatory solid description requirement (Req 6.2)
    if (!reason.trim() || reason.trim().length < 10) {
      setError('Por favor detallá un motivo descriptivo sólido para la cancelación (mínimo 10 caracteres).');
      return;
    }

    onConfirmRefund(reservation.id, reason, eligibility.percentage, estimatedRefundUSD);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
              CU-08 Cancelación y Solicitud de Reembolso
            </span>
            <h3 className="text-base font-extrabold text-stone-900 mt-1">
              Cancelar Compra #{reservation.bookingCode}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Policy Calculation Box (Req 6.3, 6.4, 6.5) */}
          <div className="p-4 rounded-2xl border space-y-2 bg-stone-50 border-stone-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700">Regla de Negocio Aplicable:</span>
              <span className={`font-black px-2.5 py-0.5 rounded-full text-xs ${
                eligibility.percentage === 100
                  ? 'bg-emerald-100 text-emerald-800'
                  : eligibility.percentage === 50
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {eligibility.percentage}% de Reembolso
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {eligibility.reasonExplanation}
            </p>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500">Monto estimado a devolver:</span>
              <strong className="text-stone-900 font-extrabold text-sm">
                {formatPrice(estimatedRefundUSD, currency)} ({currency})
              </strong>
            </div>
          </div>

          {/* Reason Input (Req 6.2) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-stone-500" />
              <span>Motivo obligatorio de cancelación (Req 6.2)</span>
            </label>
            <p className="text-[11px] text-stone-500 mb-2">
              Detallá una justificación clara. El equipo de administración de la agencia evaluará la solicitud y serás notificado por correo electrónico.
            </p>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej. Imprevisto médico laboral que me impide viajar en la fecha estipulada..."
              className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email notice note (Req 6.7) */}
          <div className="p-2.5 bg-sky-50 border border-sky-100 rounded-xl text-[11px] text-sky-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Recibirás la confirmación y seguimiento formal en tu correo: <strong>{reservation.userEmail}</strong>.</span>
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              Volver
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Confirmar Solicitud de Reembolso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
