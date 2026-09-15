import React, { useState } from 'react';
import { Currency, Reservation, SupportTicket, UserProfile } from '../types';
import { formatPrice } from '../data/mockData';
import { 
  Headphones, 
  Send, 
  Ticket, 
  Clock, 
  User, 
  CheckCircle2, 
  Phone, 
  FileText, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface AgentSupportViewProps {
  userReservations: Reservation[];
  activeTicket: SupportTicket;
  onSendMessageAsAgent: (ticketId: string, text: string) => void;
  currency: Currency;
  clientUser: UserProfile | null;
  onBackToClientView: () => void;
}

export const AgentSupportView: React.FC<AgentSupportViewProps> = ({
  userReservations,
  activeTicket,
  onSendMessageAsAgent,
  currency,
  clientUser,
  onBackToClientView,
}) => {
  const [replyText, setReplyText] = useState('');

  const quickReplies = [
    '¡Hola! Te confirmo que tu reserva tiene un plazo de 24 horas para completar el pago.',
    'He verificado en el sistema y tus asientos ya están asignados con éxito.',
    'Para solicitar una modificación de fecha, recordá que debe hacerse con más de 48hs de anticipación.',
    'El reembolso se acreditará según los términos de compra una vez evaluado por la administración.',
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendMessageAsAgent(activeTicket.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <button
            onClick={onBackToClientView}
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Vista del Viajero</span>
          </button>
          <div className="flex items-center gap-2">
            <Headphones className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Consola del Agente de Atención: Cristian
            </h1>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              CU-12 En Ejecución
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Requerimiento 9.5: Visualización simultánea del historial de reservas del usuario en pantalla para dar asistencia personalizada.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-bold text-stone-700">Estado: En Línea (Turno 09:00 - 18:00)</span>
        </div>
      </div>

      {/* Two Column Layout: Left Chat Console, Right User Reservation History (Req 9.5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Conversation (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Ticket Header */}
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                {clientUser?.name.slice(0, 2).toUpperCase() || 'US'}
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  {clientUser?.name || 'Cliente Mateo Silva'}
                </h4>
                <p className="text-[10px] text-stone-500">
                  {clientUser?.email} • {clientUser?.country}
                </p>
              </div>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              Canal Chat Activo
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50">
            {activeTicket.messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-stone-400 mb-0.5 px-1">
                    {msg.senderName} ({msg.sender === 'agent' ? 'Tú' : 'Usuario'}) • {msg.timestamp}
                  </span>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isAgent
                        ? 'bg-amber-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick canned replies for agent efficiency */}
          <div className="p-2.5 bg-stone-100 border-t border-stone-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Respuestas Rápidas del Agente:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setReplyText(qr)}
                  className="px-2 py-1 bg-white hover:bg-stone-200 text-stone-700 rounded-lg text-[10px] font-medium border border-stone-200 text-left truncate max-w-[280px]"
                  title={qr}
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>

          {/* Agent Reply input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escribí tu respuesta como Agente Cristian..."
              className="flex-1 text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
            />
            <button
              type="submit"
              className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors shrink-0 shadow-xs flex items-center gap-1 text-xs font-bold"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Responder</span>
            </button>
          </form>
        </div>

        {/* Right: User Reservation History (5 cols) - CORE REQUIREMENT 9.5 */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-5 shadow-xs flex flex-col h-[650px] overflow-hidden">
          <div className="pb-3 border-b border-stone-200 mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-sky-600" />
              <h3 className="font-extrabold text-stone-900 text-sm">
                Historial de Reservas del Usuario (Req 9.5)
              </h3>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Visible automáticamente en tu pantalla para resolver consultas de vuelos y pagos al instante.
            </p>
          </div>

          {/* List of user reservations */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {userReservations.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-8">
                El usuario no posee reservas registradas aún.
              </p>
            ) : (
              userReservations.map((res) => (
                <div
                  key={res.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                    res.status === 'pending_payment'
                      ? 'bg-amber-50/70 border-amber-200'
                      : res.status === 'confirmed_paid'
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                      #{res.bookingCode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      res.status === 'pending_payment'
                        ? 'bg-amber-200 text-amber-900'
                        : res.status === 'confirmed_paid'
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {res.status === 'pending_payment' ? 'Pendiente 24hs' : res.status === 'confirmed_paid' ? 'Pagada' : res.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-stone-900">{res.packageSnapshot.title}</h5>
                    <p className="text-stone-600 text-[11px]">
                      Salida: {res.travelDate} ({res.travelTime} hs) • Asientos: <strong>{res.seatCodes.join(', ')}</strong>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">Pasajeros: {res.passengers.length}</span>
                    <strong className="text-stone-900 font-bold">
                      {formatPrice(res.totalAmountUSD, currency)}
                    </strong>
                  </div>

                  {res.status === 'pending_payment' && (
                    <div className="text-[10px] text-amber-800 bg-amber-100/80 p-1.5 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-700" />
                      <span>Plazo 24hs expira a las {new Date(res.paymentDeadline).toLocaleTimeString('es-AR')}</span>
                    </div>
                  )}

                  {res.refundRequest && (
                    <div className="text-[10px] text-purple-900 bg-purple-100/80 p-1.5 rounded-lg">
                      Solicitud reembolso: <strong>{res.refundRequest.percentage}%</strong> ({res.refundRequest.reason})
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-stone-200 text-center">
            <span className="text-[11px] text-stone-400">
              Datos sincronizados con la base central de Viajes Mercosur
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
