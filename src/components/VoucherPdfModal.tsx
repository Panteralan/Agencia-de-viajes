import React from 'react';
import { Currency, Reservation } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { formatPrice } from '../data/mockData';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Plane, Bus } from 'lucide-react';

interface VoucherPdfModalProps {
  reservation: Reservation;
  currency: Currency;
  onClose: () => void;
}

export const VoucherPdfModal: React.FC<VoucherPdfModalProps> = ({
  reservation,
  currency,
  onClose,
}) => {
  const isFlight = reservation.packageSnapshot.transportType === 'flight';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Action Bar */}
        <div className="px-6 py-3.5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-200">
              CU-06 Documento Voucher Oficial PDF con Código QR
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Paper */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-stone-100/70" id="printable-voucher">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-stone-200 text-stone-800 space-y-6">
            {/* Voucher Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-stone-900 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center font-black text-sm">
                    VM
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-stone-900">
                      VIAJES MERCOSUR
                    </h2>
                    <p className="text-[10px] text-stone-500 uppercase font-semibold">
                      Agencia Regional Habilitada • Licencia Turismo Mercosur Nº 4819-A
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-stone-600">
                  <p><strong>Comprobante de Reserva y Embarque</strong></p>
                  <p className="text-stone-500 text-[11px]">Emitido el: {new Date(reservation.createdAt).toLocaleString('es-AR')}</p>
                </div>
              </div>

              {/* QR Code and Local Booking Code */}
              <div className="flex flex-col items-center sm:items-end">
                <QRCodeDisplay value={`VIAJES-MERCOSUR:${reservation.bookingCode}:${reservation.userEmail}`} size={110} />
                <span className="font-mono text-xs font-black tracking-wider text-stone-900 mt-1">
                  {reservation.bookingCode}
                </span>
                <span className="text-[9px] text-stone-400 uppercase">Escanear para embarque</span>
              </div>
            </div>

            {/* Payment & Security Status Badge */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-emerald-900 uppercase tracking-wider block">
                    PAGO CONFIRMADO & VALIDADO
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    Transacción {reservation.paymentDetails?.authTransactionId || 'TX-MC-VALID'} • Autorizado vía Token Bancario
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-stone-900">
                  {formatPrice(reservation.totalAmountUSD, currency)}
                </span>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div className="flex items-center gap-2">
                  {isFlight ? <Plane className="w-4 h-4 text-sky-600" /> : <Bus className="w-4 h-4 text-amber-600" />}
                  <span className="font-bold text-stone-900 text-sm">
                    {reservation.packageSnapshot.title}
                  </span>
                </div>
                <span className="text-xs font-semibold text-stone-600">
                  {reservation.packageSnapshot.carrierName} ({reservation.packageSnapshot.carrierCode})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Origen</span>
                  <span className="font-bold text-stone-800">{reservation.packageSnapshot.origin}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Destino</span>
                  <span className="font-bold text-stone-800">{reservation.packageSnapshot.destination}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Fecha y Hora</span>
                  <span className="font-bold text-stone-800">{reservation.travelDate} - {reservation.travelTime} hs</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Asientos Asignados</span>
                  <span className="font-extrabold text-sky-700 font-mono text-sm">{reservation.seatCodes.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Passengers Roster (Req 3.2) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Pasajeros Acreditados
              </h4>
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
                    <tr>
                      <th className="p-2.5 font-bold">#</th>
                      <th className="p-2.5 font-bold">Nombre Completo</th>
                      <th className="p-2.5 font-bold">Documento</th>
                      <th className="p-2.5 font-bold">Asiento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {reservation.passengers.map((pax, i) => (
                      <tr key={pax.id} className="hover:bg-stone-50">
                        <td className="p-2.5 text-stone-400 font-medium">{i + 1}</td>
                        <td className="p-2.5 font-bold text-stone-900">{pax.fullName}</td>
                        <td className="p-2.5 font-mono text-stone-700">{pax.docType} {pax.docNumber}</td>
                        <td className="p-2.5 font-mono font-bold text-sky-700">{pax.seatCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inclusions if package */}
            {reservation.packageSnapshot.isPackage && reservation.packageSnapshot.packageDetails && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1">
                <p className="font-bold text-amber-950">Servicios Incluidos en el Paquete Turístico:</p>
                <p className="text-stone-700">
                  • Hotel: <strong>{reservation.packageSnapshot.packageDetails.hotelName}</strong> ({reservation.packageSnapshot.packageDetails.nights} noches)
                </p>
                <p className="text-stone-700">
                  • Traslados in/out y Desayuno Buffet incluido en destino.
                </p>
                {reservation.packageSnapshot.packageDetails.excursionIncluded && (
                  <p className="text-stone-700">
                    • Excursión incluida: {reservation.packageSnapshot.packageDetails.excursionIncluded}
                  </p>
                )}
              </div>
            )}

            {/* Legal / Mercosur policy footer */}
            <div className="pt-3 border-t border-dashed border-stone-300 text-[10px] text-stone-500 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <p>
                  Voucher intransferible. Los cambios o cancelaciones se rigen según las reglas de negocio de Viajes Mercosur: 100% de reembolso con más de 7 días de antelación; 50% entre 48hs y 7 días; no reembolsable ni modificable dentro de las 48hs previas a la salida.
                </p>
                <p className="mt-1 font-semibold text-stone-600">
                  Presentar este documento impreso o digital con el código QR junto a su documento de identidad original en mostrador.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Enviado automáticamente por correo a <strong>{reservation.userEmail}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Listo / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
