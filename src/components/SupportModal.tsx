import React, { useState } from 'react';
import { SupportMessage, SupportTicket, UserProfile } from '../types';
import { 
  X, 
  Headphones, 
  Phone, 
  Send, 
  Clock, 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface SupportModalProps {
  currentUser: UserProfile | null;
  onClose: () => void;
  activeTicket: SupportTicket;
  onSendMessage: (ticketId: string, text: string) => void;
  onSubmitOffHoursForm: (subject: string, message: string) => void;
  onSwitchToAgentView: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  currentUser,
  onClose,
  activeTicket,
  onSendMessage,
  onSubmitOffHoursForm,
  onSwitchToAgentView,
}) => {
  // Simulator for business hours (9 to 18 hs, Req 9.3)
  const [isWithinHours, setIsWithinHours] = useState(true);
  const [inputText, setInputText] = useState('');
  const [callModalActive, setCallModalActive] = useState(false);

  // Off-hours form fields (Req 9.4)
  const [offSubject, setOffSubject] = useState('');
  const [offMessage, setOffMessage] = useState('');
  const [formSentSuccess, setFormSentSuccess] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(activeTicket.id, inputText.trim());
    setInputText('');
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offSubject.trim() || !offMessage.trim()) return;
    onSubmitOffHoursForm(offSubject, offMessage);
    setFormSentSuccess(true);
    setTimeout(() => {
      setFormSentSuccess(false);
      setOffSubject('');
      setOffMessage('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Business Hours simulation toggle */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-stone-900 text-base">
                  Atención al Cliente Mercosur
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  CU-10
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Agente Cristian • Asistencia personalizada
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operational Schedule Notice & Toggle for Testing (Req 9.3 vs 9.4) */}
        <div className="bg-stone-100 px-6 py-2.5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-500" />
            <span className="text-stone-700">
              Horario habitual de atención: <strong>09:00 a 18:00 hs</strong>
            </span>
          </div>

          {/* Test switch */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-500 font-medium">Simular horario:</span>
            <button
              type="button"
              onClick={() => setIsWithinHours(!isWithinHours)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                isWithinHours
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-700 text-stone-200'
              }`}
            >
              {isWithinHours ? 'Dentro de Horario (Chat Activo)' : 'Fuera de Horario (Formulario)'}
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isWithinHours ? (
            /* WITHIN HOURS: LIVE CHAT (Req 9.1) & CALL BUTTON (Req 9.2) */
            <div className="flex flex-col h-[380px]">
              {/* Call button action strip */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200">
                <span className="text-xs text-stone-600">¿Preferís hablar con Cristian directamente?</span>
                <button
                  type="button"
                  onClick={() => setCallModalActive(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Llamar Ahora (CU-10)</span>
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                {activeTicket.messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-stone-400 mb-0.5 px-1">
                        {msg.senderName} • {msg.timestamp}
                      </span>
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-sky-600 text-white rounded-tr-xs'
                            : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribí tu consulta sobre reservas, pagos o cambios..."
                  className="flex-1 text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-colors shrink-0 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* OUTSIDE HOURS: CONSULTATION FORM (Req 9.4) */
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Actualmente estamos fuera del horario de atención (09:00 - 18:00 hs)</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Podés enviarnos tu formulario de consulta. Nuestro agente de atención Cristian te responderá al siguiente día hábil a tu correo ({currentUser?.email || 'email registrado'}).
                </p>
              </div>

              {formSentSuccess ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-sm">¡Consulta enviada con éxito!</h4>
                  <p className="text-xs text-emerald-800">
                    Tu ticket ha sido registrado. Un agente se comunicará al inicio del próximo horario hábil (9:00 hs).
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitForm} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Asunto de la consulta
                    </label>
                    <input
                      type="text"
                      value={offSubject}
                      onChange={(e) => setOffSubject(e.target.value)}
                      placeholder="Ej. Consulta sobre equipaje o fecha de vuelo"
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      Mensaje detallado
                    </label>
                    <textarea
                      rows={4}
                      value={offMessage}
                      onChange={(e) => setOffMessage(e.target.value)}
                      placeholder="Describí tu duda o requerimiento..."
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Enviar Formulario Fuera de Horario (CU-10)</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick link to Agent Console to view CU-12 */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
            <span className="text-stone-500">¿Querés ver cómo atiende el Agente de Ventas?</span>
            <button
              type="button"
              onClick={onSwitchToAgentView}
              className="text-amber-700 hover:text-amber-900 font-bold underline"
            >
              Abrir Consola del Agente Cristian (CU-12) →
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Call Modal */}
      {callModalActive && (
        <div className="fixed inset-0 z-60 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <Phone className="w-8 h-8" />
            </div>
            <h4 className="font-extrabold text-stone-900 text-base">Llamada en Curso...</h4>
            <p className="text-xs text-stone-600">
              Conectando con Cristian (Agente Especialista en Turismo Mercosur). Línea gratuita de atención regional: <strong>0800-VIAJES-MERCOSUR</strong>.
            </p>
            <button
              onClick={() => setCallModalActive(false)}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Finalizar Llamada
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
