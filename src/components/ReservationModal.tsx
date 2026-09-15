import React, { useState } from 'react';
import { Currency, PackageOffer, Passenger, Reservation, UserProfile } from '../types';
import { SeatMapSelector } from './SeatMapSelector';
import { formatPrice } from '../data/mockData';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

interface ReservationModalProps {
  packageOffer: PackageOffer;
  currentUser: UserProfile | null;
  currency: Currency;
  onClose: () => void;
  onConfirmReservation: (newReservation: Reservation) => void;
  onRequireLogin: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  packageOffer,
  currentUser,
  currency,
  onClose,
  onConfirmReservation,
  onRequireLogin,
}) => {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Dates & Seats; Step 2: Passenger Data
  const [travelDate, setTravelDate] = useState(packageOffer.date);
  const [travelTime, setTravelTime] = useState(packageOffer.departureTime);
  const [seatCount, setSeatCount] = useState<number>(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['3A']);

  // Passengers list initialized with user data if available
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      id: 'pax-1',
      fullName: currentUser?.name || '',
      docType: currentUser?.docType || 'DNI',
      docNumber: currentUser?.docNumber || '',
      seatCode: '3A',
    },
  ]);

  const [formError, setFormError] = useState('');

  // Handle seat count change
  const handleSeatCountChange = (count: number) => {
    setSeatCount(count);
    // Trim or expand selectedSeats
    const newSelected = selectedSeats.slice(0, count);
    setSelectedSeats(newSelected);

    // Sync passengers array length
    const updatedPax: Passenger[] = [];
    for (let i = 0; i < count; i++) {
      if (passengers[i]) {
        updatedPax.push({
          ...passengers[i],
          seatCode: newSelected[i] || '',
        });
      } else {
        updatedPax.push({
          id: `pax-${i + 1}`,
          fullName: '',
          docType: 'DNI',
          docNumber: '',
          seatCode: newSelected[i] || '',
        });
      }
    }
    setPassengers(updatedPax);
  };

  const handleToggleSeat = (seatCode: string) => {
    if (selectedSeats.includes(seatCode)) {
      const updated = selectedSeats.filter((s) => s !== seatCode);
      setSelectedSeats(updated);
      syncPaxSeats(updated);
    } else {
      if (selectedSeats.length >= seatCount) {
        // replace last or don't allow
        const updated = [...selectedSeats.slice(0, seatCount - 1), seatCode];
        setSelectedSeats(updated);
        syncPaxSeats(updated);
      } else {
        const updated = [...selectedSeats, seatCode];
        setSelectedSeats(updated);
        syncPaxSeats(updated);
      }
    }
  };

  const syncPaxSeats = (seats: string[]) => {
    setPassengers((prev) =>
      prev.map((p, idx) => ({
        ...p,
        seatCode: seats[idx] || '',
      }))
    );
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleGoToStep2 = () => {
    if (!currentUser?.isRegistered) {
      onRequireLogin();
      return;
    }
    if (selectedSeats.length !== seatCount) {
      setFormError(`Debes seleccionar exactamente ${seatCount} asiento(s) en el mapa interactivo.`);
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handleCompleteBooking = () => {
    // Validate passengers data (Req 3.2)
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.fullName.trim()) {
        setFormError(`Por favor ingresá el nombre completo del Pasajero ${i + 1}.`);
        return;
      }
      if (!p.docNumber.trim()) {
        setFormError(`Por favor ingresá el número de documento del Pasajero ${i + 1}.`);
        return;
      }
    }

    setFormError('');

    // Generate Booking Code: VM-XXXXX
    const randomCode = `VM-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now (Req 2.5)

    const discountMultiplier = packageOffer.promotionDiscountPercent 
      ? (100 - packageOffer.promotionDiscountPercent) / 100 
      : 1;
    const totalUSD = Math.round(packageOffer.priceUSD * seatCount * discountMultiplier);

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      bookingCode: randomCode,
      userId: currentUser!.id,
      userEmail: currentUser!.email,
      userName: currentUser!.name,
      packageId: packageOffer.id,
      packageSnapshot: packageOffer,
      travelDate,
      travelTime,
      seatCodes: selectedSeats,
      passengers,
      totalAmountUSD: totalUSD,
      status: 'pending_payment',
      createdAt: now.toISOString(),
      paymentDeadline: deadline.toISOString(),
    };

    onConfirmReservation(newReservation);
  };

  const totalCalculatedUSD = Math.round(
    packageOffer.priceUSD * seatCount * (packageOffer.promotionDiscountPercent ? (100 - packageOffer.promotionDiscountPercent) / 100 : 1)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                CU-05 Formulario de Reserva
              </span>
              <span className="text-xs text-stone-400">Paso {step} de 2</span>
            </div>
            <h3 className="text-lg font-extrabold text-stone-900 mt-1">
              {packageOffer.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: DATE, TIME, AND SEAT MAP SELECTION (Req 2.2, 2.3, 3.1) */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Date selection (Req 2.2) */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>Fecha del Viaje</span>
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl font-medium focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Time selection (Req 2.2) */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>Horario de Salida</span>
                  </label>
                  <select
                    value={travelTime}
                    onChange={(e) => setTravelTime(e.target.value)}
                    className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl font-medium focus:bg-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="07:45">07:45 hs (Mañana)</option>
                    <option value="11:30">11:30 hs (Mañana)</option>
                    <option value="15:15">15:15 hs (Tarde)</option>
                    <option value="19:30">19:30 hs (Noche)</option>
                    <option value="22:00">22:00 hs (Noche)</option>
                  </select>
                </div>

                {/* Seat Quantity (Req 2.3) */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    <span>Cantidad Asientos</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSeatCountChange(num)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          seatCount === num
                            ? 'bg-sky-600 text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Seat Map Selector (Req 3.1) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Elegí {seatCount} asiento(s) en el mapa interactivo:
                </label>
                <SeatMapSelector
                  transportType={packageOffer.transportType}
                  requiredSeats={seatCount}
                  selectedSeats={selectedSeats}
                  onToggleSeat={handleToggleSeat}
                />
              </div>

              {/* Important 24h condition note (Req 2.5) */}
              <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Importante: Plazo de pago de 24 horas</strong>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Al confirmar la reserva, quedará bloqueada en tu perfil por 24 horas. Si no completás el pago dentro de ese lapso, los asientos se liberan automáticamente.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: PASSENGERS DATA FOR ALL SEATS (Req 3.2) */
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-2">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-sky-600" />
                  <span>Datos de los Pasajeros (Obligatorio para cada asiento)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Por reglamentación del Mercosur, se requiere nombre y documento de cada viajero.
                </p>
              </div>

              <div className="space-y-3">
                {passengers.map((pax, idx) => (
                  <div key={pax.id} className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-800">
                        Pasajero #{idx + 1} {idx === 0 && '(Titular de compra)'}
                      </span>
                      <span className="text-xs font-semibold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                        Asiento: {pax.seatCode || 'Pendiente'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-6">
                        <label className="block text-[10px] font-bold text-stone-500 uppercase">
                          Nombre y Apellido
                        </label>
                        <input
                          type="text"
                          value={pax.fullName}
                          onChange={(e) => handlePassengerChange(idx, 'fullName', e.target.value)}
                          placeholder="Ej. Juan Pérez"
                          className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-stone-500 uppercase">
                          Tipo Doc
                        </label>
                        <select
                          value={pax.docType}
                          onChange={(e) => handlePassengerChange(idx, 'docType', e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-hidden"
                        >
                          <option value="DNI">DNI</option>
                          <option value="Pasaporte">Pasaporte</option>
                          <option value="CPF">CPF (Brasil)</option>
                          <option value="CI">C.I.</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-stone-500 uppercase">
                          Nº Documento
                        </label>
                        <input
                          type="text"
                          value={pax.docNumber}
                          onChange={(e) => handlePassengerChange(idx, 'docNumber', e.target.value)}
                          placeholder="Ej. 38452190"
                          className="w-full text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price summary */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-600 block">Total a pagar ({seatCount} pasajero{seatCount > 1 ? 's' : ''}):</span>
                  <span className="text-xl font-extrabold text-sky-900">
                    {formatPrice(totalCalculatedUSD, currency)}
                  </span>
                  <span className="text-[11px] text-stone-500 ml-1.5">({currency})</span>
                </div>
                <div className="text-right text-[11px] text-stone-500 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Reserva protegida por 24hs</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Asientos</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              Cancelar
            </button>
          )}

          {step === 1 ? (
            <button
              id="btn-modal-next-step"
              type="button"
              onClick={handleGoToStep2}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Continuar a Datos de Pasajeros</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-confirm-reservation"
              type="button"
              onClick={handleCompleteBooking}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Confirmar Reserva (Bloquear por 24hs)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
