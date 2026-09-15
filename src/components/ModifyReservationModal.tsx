import React, { useState } from 'react';
import { Currency, Reservation } from '../types';
import { calculateModificationEligibility } from '../utils/helpers';
import { formatPrice } from '../data/mockData';
import { SeatMapSelector } from './SeatMapSelector';
import { X, Calendar, Lock, AlertCircle, CheckCircle2, ShieldBan } from 'lucide-react';

interface ModifyReservationModalProps {
  reservation: Reservation;
  currency: Currency;
  onClose: () => void;
  onConfirmModification: (
    reservationId: string,
    newDate: string,
    newSeats: string[],
    feeUSD: number
  ) => void;
}

export const ModifyReservationModal: React.FC<ModifyReservationModalProps> = ({
  reservation,
  currency,
  onClose,
  onConfirmModification,
}) => {
  const [newDate, setNewDate] = useState(reservation.travelDate);
  const [newSeats, setNewSeats] = useState<string[]>([...reservation.seatCodes]);
  const [error, setError] = useState('');

  const eligibility = calculateModificationEligibility(reservation.travelDate);

  const handleToggleSeat = (seatCode: string) => {
    const requiredCount = reservation.seatCodes.length;
    if (newSeats.includes(seatCode)) {
      setNewSeats(newSeats.filter((s) => s !== seatCode));
    } else {
      if (newSeats.length >= requiredCount) {
        setNewSeats([...newSeats.slice(0, requiredCount - 1), seatCode]);
      } else {
        setNewSeats([...newSeats, seatCode]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibility.canModify) {
      setError('La reserva está bloqueada para modificaciones debido a la cercanía con el viaje (<48 hs).');
      return;
    }

    if (newSeats.length !== reservation.seatCodes.length) {
      setError(`Debes seleccionar exactamente ${reservation.seatCodes.length} asiento(s).`);
      return;
    }

    onConfirmModification(reservation.id, newDate, newSeats, eligibility.feeUSD);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
              CU-09 Modificación de Reserva
            </span>
            <h3 className="text-base font-extrabold text-stone-900 mt-1">
              Modificar Reserva #{reservation.bookingCode}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Eligibility or Blocked status (Req 7.3, 7.4) */}
          {!eligibility.canModify ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-3">
              <ShieldBan className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-sm">Modificación Bloqueada (&lt;48 hs)</strong>
                <p className="mt-1">{eligibility.explanation}</p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900 flex items-center justify-between">
              <div>
                <span className="font-bold block">Penalidad / Costo por Cambio (Req 7.3):</span>
                <p className="text-[11px] text-sky-800">{eligibility.explanation}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-sky-950">
                  {formatPrice(eligibility.feeUSD, currency)}
                </span>
                <span className="text-[10px] text-stone-500 block">({currency})</span>
              </div>
            </div>
          )}

          {/* Locked Passengers notice (Req 7.2) */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <div>
                <span className="font-bold block text-stone-900">Identidad de Pasajeros (Bloqueada)</span>
                <span className="text-[11px] text-stone-500">
                  {reservation.passengers.map((p) => p.fullName).join(', ')}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
              Reglamento Mercosur (Req 7.2)
            </span>
          </div>

          {/* Date Selector (Req 7.1) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Nueva Fecha de Viaje</span>
            </label>
            <input
              type="date"
              disabled={!eligibility.canModify}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden disabled:opacity-50"
            />
          </div>

          {/* Seat Map Selector (Req 7.1) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Reasignar {reservation.seatCodes.length} Asiento(s) en Mapa:
            </label>
            {eligibility.canModify && (
              <SeatMapSelector
                transportType={reservation.packageSnapshot.transportType}
                requiredSeats={reservation.seatCodes.length}
                selectedSeats={newSeats}
                onToggleSeat={handleToggleSeat}
              />
            )}
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={!eligibility.canModify}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar y Abonar Cambio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
