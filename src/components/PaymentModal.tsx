import React, { useState } from 'react';
import { Currency, Reservation } from '../types';
import { formatPrice } from '../data/mockData';
import { 
  X, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  reservation: Reservation;
  currency: Currency;
  onClose: () => void;
  onPaymentSuccess: (updatedReservation: Reservation) => void;
  onPaymentFailureNotify: (msg: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  reservation,
  currency,
  onClose,
  onPaymentSuccess,
  onPaymentFailureNotify,
}) => {
  const [method, setMethod] = useState<'credit_card' | 'debit_card' | 'paypal'>('credit_card');
  const [cardNumber, setCardNumber] = useState('4532 8920 1192 4819');
  const [cardHolder, setCardHolder] = useState(reservation.userName || 'Mateo Silva');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('883');
  const [paypalEmail, setPaypalEmail] = useState(reservation.userEmail || 'usuario@mercosur.com');

  // Token Bancario / OTP (Req 5.2)
  const [bankToken, setBankToken] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [simulateFailureMode, setSimulateFailureMode] = useState(false);

  const localPriceString = formatPrice(reservation.totalAmountUSD, currency);

  const handleFillDemoToken = () => {
    // Generate 6 digit banking token
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    setBankToken(token);
    setErrorMessage('');
  };

  const handleProcessPayment = () => {
    setErrorMessage('');

    if (method !== 'paypal' && (!cardNumber || !cardHolder || !cardExpiry || !cardCvv)) {
      setErrorMessage('Por favor completá todos los datos de la tarjeta.');
      return;
    }

    if (method === 'paypal' && !paypalEmail) {
      setErrorMessage('Ingresá tu correo electrónico de PayPal.');
      return;
    }

    // Mandatory banking token check (Req 5.2)
    if (!bankToken.trim() || bankToken.trim().length < 6) {
      setErrorMessage('Debes ingresar el Token Bancario o Clave Digital de 6 dígitos de tu app bancaria móvil para autorizar la transacción encriptada.');
      return;
    }

    setIsProcessing(true);

    // Simulate 1.5s secure gateway communication
    setTimeout(() => {
      setIsProcessing(false);

      // Check if simulated failure is triggered
      if (simulateFailureMode) {
        setErrorMessage('El pago fue rechazado por el emisor bancario o el Token de seguridad expiró. Podes reintentar dentro de las 24hs de tu plazo de reserva.');
        onPaymentFailureNotify(`Intento de pago fallido para la reserva ${reservation.bookingCode}. Dispones de tiempo para reintentar.`);
        return;
      }

      // Success
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }

      const updatedReservation: Reservation = {
        ...reservation,
        status: 'confirmed_paid',
        paidAmountLocal: Math.round(reservation.totalAmountUSD * 1280),
        paidCurrency: currency,
        paymentDetails: {
          method,
          cardLast4: method !== 'paypal' ? cardNumber.slice(-4) : undefined,
          cardHolder: method !== 'paypal' ? cardHolder : undefined,
          paypalEmail: method === 'paypal' ? paypalEmail : undefined,
          paidAt: new Date().toISOString(),
          authTransactionId: `TX-MC-${Math.floor(100000 + Math.random() * 900000)}`,
          tokenApproved: true,
        },
      };

      onPaymentSuccess(updatedReservation);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              CU-06 Pasarela de Pago Segura (24hs)
            </span>
            <h3 className="text-lg font-extrabold text-stone-900 mt-1">
              Confirmar Pago de Reserva #{reservation.bookingCode}
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
          {/* Reservation recap */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-stone-900 text-sm">{reservation.packageSnapshot.title}</p>
              <p className="text-stone-500 mt-0.5">
                Salida: {reservation.travelDate} a las {reservation.travelTime} hs • Asientos: {reservation.seatCodes.join(', ')}
              </p>
              <p className="text-stone-500">
                {reservation.passengers.length} Pasajero(s) registrado(s)
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-stone-400 uppercase font-bold block">Total</span>
              <span className="text-lg font-extrabold text-emerald-800">{localPriceString}</span>
              <span className="text-[10px] text-stone-500 block">({currency})</span>
            </div>
          </div>

          {/* Payment Method Selector (Req 4.2) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Seleccionar Método de Pago
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('credit_card')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                  method === 'credit_card'
                    ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-sky-600" />
                <span>Tarjeta de Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('debit_card')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                  method === 'debit_card'
                    ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-teal-600" />
                <span>Tarjeta de Débito</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('paypal')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors ${
                  method === 'paypal'
                    ? 'border-sky-600 bg-sky-50 text-sky-900 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Lock className="w-5 h-5 text-indigo-600" />
                <span>PayPal</span>
              </button>
            </div>
          </div>

          {/* Card or Paypal form */}
          {method !== 'paypal' ? (
            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                  Número de Tarjeta (16 dígitos)
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full text-xs font-mono p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                    Titular como figura en la tarjeta
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Vencimiento
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                Correo Asociado a PayPal
              </label>
              <input
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-hidden"
              />
            </div>
          )}

          {/* Security & Banking Token Step (Req 5.1, 5.2, 5.3) */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Autenticación Bancaria de Seguridad (Req 5.2)</span>
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                Encriptación SSL 256-bit Activa
              </span>
            </div>

            <p className="text-xs text-emerald-800">
              Para validar la compra, ingresá el <strong>Token Móvil</strong> o clave digital de 6 dígitos generada en la aplicación de tu entidad bancaria.
            </p>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <KeyRound className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                <input
                  id="input-banking-token"
                  type="text"
                  maxLength={6}
                  value={bankToken}
                  onChange={(e) => setBankToken(e.target.value)}
                  placeholder="Código Token (6 dígitos)"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold tracking-widest bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-center"
                />
              </div>

              <button
                type="button"
                onClick={handleFillDemoToken}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                title="Generar Token Simulado"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simular Token</span>
              </button>
            </div>
          </div>

          {/* Simulated failure toggle for testing exception handling (Req 11.1, 11.2) */}
          <div className="flex items-center justify-between p-2.5 bg-stone-100 rounded-xl border border-stone-200 text-xs">
            <span className="text-stone-600 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Simular Pago Fallido / Token Expirado (Req 11.1)</span>
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={simulateFailureMode}
                onChange={(e) => setSimulateFailureMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800"
          >
            Cerrar
          </button>

          <button
            id="btn-process-payment"
            type="button"
            disabled={isProcessing}
            onClick={handleProcessPayment}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors disabled:opacity-75"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Encriptando y Procesando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Pagar {localPriceString} ({currency})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
