import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, Layers, FileSpreadsheet, ExternalLink } from 'lucide-react';

interface RequirementsDrawerProps {
  onClose: () => void;
  onNavigateTo: (action: string) => void;
}

export const RequirementsDrawer: React.FC<RequirementsDrawerProps> = ({
  onClose,
  onNavigateTo,
}) => {
  const [activeTab, setActiveTab] = useState<'use_cases' | 'requirements'>('use_cases');

  const useCases = [
    {
      id: 'CU-01',
      title: 'Buscar vuelos y paquetes',
      reqs: '1.1, 1.2, 1.3, 1.4, 1.5, 14.5',
      action: 'search',
      desc: 'Búsqueda por origen, destino, fechas, precios, filtros de horario (mañana/tarde/noche) y tipo de transporte (vuelo/bus) en <3 segundos.',
    },
    {
      id: 'CU-02',
      title: 'Registrarse',
      reqs: '8.1, 8.2, 8.3',
      action: 'register',
      desc: 'Registro de usuario con Nombre, Documento, Teléfono, País del Mercosur, Email y Contraseña.',
    },
    {
      id: 'CU-03',
      title: 'Iniciar sesión',
      reqs: '8.4',
      action: 'login',
      desc: 'Autenticación con email y contraseña encriptada.',
    },
    {
      id: 'CU-04',
      title: 'Recuperar contraseña',
      reqs: '8.5',
      action: 'forgot',
      desc: 'Envío de enlace de restablecimiento al correo registrado.',
    },
    {
      id: 'CU-05',
      title: 'Realizar una reserva',
      reqs: '2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2',
      action: 'book',
      desc: 'Selección de fecha/hora, mapa interactivo de asientos (avión/bus), datos de todos los pasajeros y bloqueo de 24hs para pagar.',
    },
    {
      id: 'CU-06',
      title: 'Pagar una reserva',
      reqs: '4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 11.1, 11.2, 11.3',
      action: 'pay',
      desc: 'Pago con Tarjetas o PayPal, validación de Token Bancario Móvil de 6 dígitos, confirmación por email y generación de Voucher PDF con código QR.',
    },
    {
      id: 'CU-07',
      title: 'Cancelar una reserva (sin costo)',
      reqs: '6.1',
      action: 'reservations',
      desc: 'Cancelación inmediata de reservas pendientes dentro del plazo de 24hs con liberación de asientos.',
    },
    {
      id: 'CU-08',
      title: 'Cancelar una compra / solicitar reembolso',
      reqs: '6.2, 6.3, 6.4, 6.5, 6.6, 6.7',
      action: 'refund',
      desc: 'Regla de negocio: 100% reembolso >7 días antes, 50% entre 48hs y 7 días, 0% <48hs. Motivo obligatorio y notificación por correo.',
    },
    {
      id: 'CU-09',
      title: 'Modificar una reserva',
      reqs: '7.1, 7.2, 7.3, 7.4',
      action: 'modify',
      desc: 'Cambio de fecha y asientos. Identidad de pasajeros bloqueada (Req 7.2). Costo variable y bloqueo total a menos de 48hs.',
    },
    {
      id: 'CU-10',
      title: 'Contactar a un agente',
      reqs: '9.1, 9.2, 9.3, 9.4',
      action: 'support',
      desc: 'Chat en vivo y botón de llamada en horario de 9 a 18 hs. Formulario fuera de horario con respuesta al siguiente día hábil.',
    },
    {
      id: 'CU-11',
      title: 'Configurar notificaciones',
      reqs: '10.6',
      action: 'notif_settings',
      desc: 'Personalización de canales (Push y Email) y tipos de alertas (horarios, ofertas, vencimiento de 24hs, reembolsos).',
    },
    {
      id: 'CU-12',
      title: 'Atender consultas (Agente de Ventas)',
      reqs: '9.5',
      action: 'agent_view',
      desc: 'Consola del Agente Cristian: chat en vivo con visualización simultánea del historial de reservas del cliente.',
    },
    {
      id: 'CU-13',
      title: 'Gestionar paquetes y ofertas turísticas',
      reqs: '15.1, 15.2',
      action: 'backoffice_packages',
      desc: 'Carga de nuevos paquetes turísticos y actualización de catálogo existente desde el back-office.',
    },
    {
      id: 'CU-14',
      title: 'Gestionar promociones',
      reqs: '15.3, 15.4, 15.5',
      action: 'backoffice_promos',
      desc: 'Creación, modificación de porcentajes de descuento y eliminación de promociones desde el panel.',
    },
    {
      id: 'CU-15',
      title: 'Gestionar reservas y cancelaciones de usuarios',
      reqs: '15.6, 15.7, 15.8',
      action: 'backoffice_res',
      desc: 'Visualización de reservas entrantes y aprobación de cancelaciones/reembolsos por el personal de la agencia.',
    },
    {
      id: 'CU-16',
      title: 'Notificar eventos al usuario (Sistema automático)',
      reqs: '10.1, 10.2, 10.3, 10.4, 10.5, 6.7',
      action: 'notifications',
      desc: 'Disparo automático de alertas push y correos ante reservas, pagos, vencimientos de plazo y cambios.',
    },
    {
      id: 'CU-17',
      title: 'Sincronizar disponibilidad con GDS externos',
      reqs: '12.1, 12.2',
      action: 'sync_gds',
      desc: 'Conexión y sincronización en tiempo real con GDS y APIs de aerolíneas/hoteles para disponibilidad de asientos.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-end">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-stone-200 overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                Matriz de Trazabilidad y Casos de Uso
              </h3>
              <p className="text-[11px] text-stone-400">
                17 Casos de Uso • 69 Requerimientos Atómicos Funcionales
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-stone-50">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 text-xs text-sky-950 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Prototipo 100% Funcional e Interactivo</strong>
              <p className="text-[11px] text-sky-800 mt-0.5">
                Hacé click en cualquiera de los casos de uso para navegar directamente a la pantalla o disparar el flujo correspondiente.
              </p>
            </div>
          </div>

          {useCases.map((cu) => (
            <div
              key={cu.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:border-sky-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-black font-mono text-xs bg-stone-900 text-white px-2 py-0.5 rounded">
                    {cu.id}
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm">{cu.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => { onNavigateTo(cu.action); onClose(); }}
                  className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Probar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed mb-2">
                {cu.desc}
              </p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                <span>Requerimientos asociados: <strong className="text-stone-600 font-mono">{cu.reqs}</strong></span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Implementado</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-stone-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
          >
            Cerrar Matriz
          </button>
        </div>
      </div>
    </div>
  );
};
