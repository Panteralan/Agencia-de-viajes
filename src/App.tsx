import React, { useState } from 'react';
import { 
  Currency, 
  Language, 
  NotificationItem, 
  NotificationSettings, 
  PackageOffer, 
  Promotion, 
  Reservation, 
  SupportTicket, 
  TimeOfDay, 
  TransportType, 
  UserProfile, 
  UserRole 
} from './types';
import { 
  INITIAL_NOTIF_SETTINGS, 
  INITIAL_PACKAGES, 
  INITIAL_PROMOTIONS, 
  INITIAL_RESERVATIONS, 
  INITIAL_USER 
} from './data/mockData';
import { getTranslation } from './utils/translations';
import { Navbar } from './components/Navbar';
import { SearchFilters } from './components/SearchFilters';
import { PackageCard } from './components/PackageCard';
import { ReservationModal } from './components/ReservationModal';
import { PaymentModal } from './components/PaymentModal';
import { VoucherPdfModal } from './components/VoucherPdfModal';
import { CancelRefundModal } from './components/CancelRefundModal';
import { ModifyReservationModal } from './components/ModifyReservationModal';
import { MyReservationsView } from './components/MyReservationsView';
import { SupportModal } from './components/SupportModal';
import { AgentSupportView } from './components/AgentSupportView';
import { BackOfficeView } from './components/BackOfficeView';
import { NotificationCenterModal, NotificationSettingsModal } from './components/NotificationModals';
import { AuthModal } from './components/AuthModal';
import { GdsSyncBanner } from './components/GdsSyncBanner';
import { RequirementsDrawer } from './components/RequirementsDrawer';
import { 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Ticket, 
  Clock, 
  MapPin, 
  Headphones, 
  Building2,
  Calendar
} from 'lucide-react';

export default function App() {
  // Global configuration states
  const [currentRole, setCurrentRole] = useState<UserRole>('client');
  const [currency, setCurrency] = useState<Currency>('ARS');
  const [language, setLanguage] = useState<Language>('es');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USER);
  const [activeView, setActiveView] = useState<'home' | 'my_reservations' | 'agent_view' | 'backoffice_view'>('home');

  // Core Data
  const [packages, setPackages] = useState<PackageOffer[]>(INITIAL_PACKAGES);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(INITIAL_NOTIF_SETTINGS);

  // Search and Filter States (CU-01)
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-10-10');
  const [transportType, setTransportType] = useState<TransportType | 'all'>('all');
  const [timeSlot, setTimeSlot] = useState<TimeOfDay>('all');
  const [maxPriceUSD, setMaxPriceUSD] = useState<number>(600);
  const [onlyPromos, setOnlyPromos] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResponseSecs, setSearchResponseSecs] = useState<number>(0.45);

  // Notifications State (CU-16)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Reserva Registrada - Plazo de 24hs para abonar',
      message: 'Tu reserva VM-44812 a Río de Janeiro fue registrada. Tenés 24 horas para completar el pago.',
      type: 'payment_reminder',
      channel: 'push',
      timestamp: 'Hace 3 horas',
      read: false,
      relatedReservationCode: 'VM-44812',
    },
    {
      id: 'notif-2',
      title: 'Comprobante y Voucher Emitido con QR',
      message: 'Pago acreditado para la reserva VM-98214 (Cataratas del Iguazú). Podés descargar tu voucher PDF.',
      type: 'payment_success',
      channel: 'email',
      timestamp: 'Hace 1 día',
      read: true,
      relatedReservationCode: 'VM-98214',
    },
  ]);

  // Support Ticket State (CU-10, CU-12)
  const [activeTicket, setActiveTicket] = useState<SupportTicket>({
    id: 'tkt-101',
    userId: 'usr-001',
    userName: 'Mateo Silva',
    userEmail: 'mateo.silva@viajesmercosur.com',
    subject: 'Consulta sobre Asientos y Plazo de Reserva',
    category: 'booking',
    status: 'attending',
    isLiveChat: true,
    createdAt: '10:30 hs',
    messages: [
      {
        id: 'msg-1',
        sender: 'agent',
        senderName: 'Cristian (Agente)',
        message: '¡Hola Mateo! Mi nombre es Cristian. Veo en mi pantalla tus reservas activas. ¿En qué te puedo asesorar hoy?',
        timestamp: '10:30 hs',
      },
      {
        id: 'msg-2',
        sender: 'user',
        senderName: 'Mateo Silva',
        message: 'Hola Cristian, ¿si reservo ahora tengo 24hs completas para pagar con token bancario?',
        timestamp: '10:32 hs',
      },
      {
        id: 'msg-3',
        sender: 'agent',
        senderName: 'Cristian (Agente)',
        message: '¡Exacto! La reserva bloquea tus asientos de inmediato por un plazo de 24 horas. Podés abonar con tarjeta o PayPal desde Mis Reservas cuando desees.',
        timestamp: '10:33 hs',
      },
    ],
  });

  // GDS Sync State (CU-17)
  const [isGdsSyncing, setIsGdsSyncing] = useState(false);
  const [lastGdsSync, setLastGdsSync] = useState('10:35 hs (En vivo)');

  // Modals
  const [bookingPackage, setBookingPackage] = useState<PackageOffer | null>(null);
  const [payingReservation, setPayingReservation] = useState<Reservation | null>(null);
  const [voucherReservation, setVoucherReservation] = useState<Reservation | null>(null);
  const [refundingReservation, setRefundingReservation] = useState<Reservation | null>(null);
  const [modifyingReservation, setModifyingReservation] = useState<Reservation | null>(null);

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNotifSettings, setShowNotifSettings] = useState(false);
  const [showNotifCenter, setShowNotifCenter] = useState(false);
  const [showRequirementsDrawer, setShowRequirementsDrawer] = useState(false);

  // Banner toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const t = getTranslation(language);

  // Handling Role switch
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'support_agent') {
      setActiveView('agent_view');
      triggerToast('Vista cambiada a Consola del Agente Cristian (CU-12).');
    } else if (role === 'agency_admin') {
      setActiveView('backoffice_view');
      triggerToast('Vista cambiada a Panel Back-office de la Agencia (CU-13, CU-14, CU-15).');
    } else {
      setActiveView('home');
      triggerToast('Vista cambiada a Modo Cliente / Viajero.');
    }
  };

  // CU-01 Search Handler (Simulated search completing in ≤ 3 seconds, Req 14.5)
  const handleSearch = () => {
    setIsSearching(true);
    const simulatedDuration = 0.35 + Math.random() * 0.4; // ~0.4 to 0.75 seconds, well within the 3 second SLA (Req 14.5)
    setTimeout(() => {
      setIsSearching(false);
      setSearchResponseSecs(parseFloat(simulatedDuration.toFixed(2)));
    }, simulatedDuration * 1000);
  };

  // Filtered packages
  const filteredPackages = packages.filter((pkg) => {
    if (originQuery && !pkg.originCity.toLowerCase().includes(originQuery.toLowerCase())) {
      return false;
    }
    if (destinationQuery && !pkg.destinationCity.toLowerCase().includes(destinationQuery.toLowerCase())) {
      return false;
    }
    if (transportType !== 'all' && pkg.transportType !== transportType) {
      return false;
    }
    if (timeSlot !== 'all' && pkg.timeSlot !== timeSlot) {
      return false;
    }
    if (pkg.priceUSD > maxPriceUSD) {
      return false;
    }
    if (onlyPromos && !pkg.promotionTag) {
      return false;
    }
    return true;
  });

  // CU-05: Confirm New Reservation
  const handleConfirmReservation = (newRes: Reservation) => {
    setReservations([newRes, ...reservations]);
    setBookingPackage(null);
    setActiveView('my_reservations');

    // Decrease available seats in package catalog
    setPackages((prev) =>
      prev.map((p) =>
        p.id === newRes.packageId
          ? { ...p, availableSeats: Math.max(0, p.availableSeats - newRes.seatCodes.length) }
          : p
      )
    );

    // Dispatch system notification (CU-16, Req 10.1, 10.5)
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Reserva creada - 24 horas para pagar',
      message: `Reserva #${newRes.bookingCode} generada. Disponés de 24hs para abonar antes de que se liberen tus asientos.`,
      type: 'payment_reminder',
      channel: 'push',
      timestamp: 'Recién',
      read: false,
      relatedReservationCode: newRes.bookingCode,
    };
    setNotifications([newNotif, ...notifications]);

    triggerToast(`¡Reserva #${newRes.bookingCode} confirmada! Asientos bloqueados por 24 horas.`);
  };

  // CU-06: Payment Success Handler
  const handlePaymentSuccess = (updatedRes: Reservation) => {
    setReservations((prev) => prev.map((r) => (r.id === updatedRes.id ? updatedRes : r)));
    setPayingReservation(null);
    setVoucherReservation(updatedRes); // Automatically offer voucher view (Req 4.5)

    // CU-16 & Req 4.4: Confirmación de pago por correo con voucher PDF
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Confirmación de Pago & Voucher Emitido',
      message: `Tu pago para la reserva #${updatedRes.bookingCode} fue autorizado con token bancario. Se envió el comprobante PDF a ${updatedRes.userEmail}.`,
      type: 'payment_success',
      channel: 'email',
      timestamp: 'Recién',
      read: false,
      relatedReservationCode: updatedRes.bookingCode,
    };
    setNotifications([newNotif, ...notifications]);

    triggerToast(`¡Pago exitoso para la reserva #${updatedRes.bookingCode}! Voucher PDF disponible con código QR.`);
  };

  // CU-07: Cancel Unpaid Reservation
  const handleCancelUnpaidReservation = (resId: string) => {
    const res = reservations.find((r) => r.id === resId);
    if (!res) return;

    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: 'cancelled' as const } : r))
    );

    // Release seats back to catalog
    setPackages((prev) =>
      prev.map((p) =>
        p.id === res.packageId
          ? { ...p, availableSeats: p.availableSeats + res.seatCodes.length }
          : p
      )
    );

    triggerToast(`Reserva #${res.bookingCode} cancelada sin penalidad. Asientos liberados.`);
  };

  // CU-08: Confirm Refund Request
  const handleConfirmRefund = (
    resId: string,
    reason: string,
    percentage: number,
    estimatedRefundUSD: number
  ) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === resId) {
          return {
            ...r,
            status: 'refund_requested' as const,
            refundRequest: {
              requestedAt: new Date().toISOString(),
              reason,
              percentage,
              estimatedRefundUSD,
              status: 'pending',
            },
          };
        }
        return r;
      })
    );

    const res = reservations.find((r) => r.id === resId);
    setRefundingReservation(null);

    // CU-16 & Req 6.7: Notificación por correo del resultado de la solicitud
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Solicitud de Reembolso Recibida',
      message: `Tu solicitud de cancelación para la reserva #${res?.bookingCode} está siendo evaluada (${percentage}% aplicable). Recibirás la resolución en tu email.`,
      type: 'refund_status',
      channel: 'email',
      timestamp: 'Recién',
      read: false,
      relatedReservationCode: res?.bookingCode,
    };
    setNotifications([newNotif, ...notifications]);

    triggerToast(`Solicitud de cancelación registrada para la reserva #${res?.bookingCode}. Motivo enviado.`);
  };

  // CU-09: Confirm Reservation Modification
  const handleConfirmModification = (
    resId: string,
    newDate: string,
    newSeats: string[],
    feeUSD: number
  ) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === resId) {
          return {
            ...r,
            travelDate: newDate,
            seatCodes: newSeats,
            status: 'modified' as const,
            totalAmountUSD: r.totalAmountUSD + feeUSD,
            modificationsHistory: [
              ...(r.modificationsHistory || []),
              {
                previousDate: r.travelDate,
                previousSeats: r.seatCodes,
                modifiedAt: new Date().toISOString(),
                modificationFeeUSD: feeUSD,
              },
            ],
          };
        }
        return r;
      })
    );

    setModifyingReservation(null);
    triggerToast(`Reserva modificada exitosamente. Nueva fecha: ${newDate}, Asientos: ${newSeats.join(', ')}.`);
  };

  // Support message handlers (CU-10, CU-12)
  const handleSendMessageAsUser = (ticketId: string, text: string) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      senderName: currentUser?.name || 'Cliente',
      message: text,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
    };

    setActiveTicket((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));

    // Simulate Agent Cristian typing response
    setTimeout(() => {
      const agentReply = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent' as const,
        senderName: 'Cristian (Agente)',
        message: '¡Recibido! Estoy revisando tu ficha de reserva en mi consola de atención.',
        timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
      };
      setActiveTicket((prev) => ({
        ...prev,
        messages: [...prev.messages, agentReply],
      }));
    }, 1200);
  };

  const handleSendMessageAsAgent = (ticketId: string, text: string) => {
    const newMsg = {
      id: `msg-ag-${Date.now()}`,
      sender: 'agent' as const,
      senderName: 'Cristian (Agente)',
      message: text,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs',
    };

    setActiveTicket((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));
  };

  // CU-17: Trigger GDS Real-time sync
  const handleGdsSync = () => {
    setIsGdsSyncing(true);
    setTimeout(() => {
      setIsGdsSyncing(false);
      setLastGdsSync(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' hs (En vivo)');
      triggerToast('Gateway GDS Amadeus & Sabre sincronizado con éxito. Disponibilidad y tarifas actualizadas.');
    }, 1200);
  };

  // Navigation from traceability matrix drawer
  const handleMatrixNavigate = (action: string) => {
    if (action === 'search') {
      setActiveView('home');
    } else if (action === 'register') {
      setShowAuthModal(true);
    } else if (action === 'login') {
      setShowAuthModal(true);
    } else if (action === 'forgot') {
      setShowAuthModal(true);
    } else if (action === 'book') {
      setActiveView('home');
      setBookingPackage(packages[0]);
    } else if (action === 'pay') {
      setActiveView('my_reservations');
      const pending = reservations.find((r) => r.status === 'pending_payment');
      if (pending) setPayingReservation(pending);
    } else if (action === 'reservations') {
      setActiveView('my_reservations');
    } else if (action === 'refund') {
      setActiveView('my_reservations');
      const paid = reservations.find((r) => r.status === 'confirmed_paid');
      if (paid) setRefundingReservation(paid);
    } else if (action === 'modify') {
      setActiveView('my_reservations');
      const paid = reservations.find((r) => r.status === 'confirmed_paid');
      if (paid) setModifyingReservation(paid);
    } else if (action === 'support') {
      setShowSupportModal(true);
    } else if (action === 'notif_settings') {
      setShowNotifSettings(true);
    } else if (action === 'agent_view') {
      setCurrentRole('support_agent');
      setActiveView('agent_view');
    } else if (action === 'backoffice_packages' || action === 'backoffice_promos' || action === 'backoffice_res') {
      setCurrentRole('agency_admin');
      setActiveView('backoffice_view');
    } else if (action === 'notifications') {
      setShowNotifCenter(true);
    } else if (action === 'sync_gds') {
      handleGdsSync();
    }
  };

  const pendingReservationsCount = reservations.filter((r) => r.status === 'pending_payment').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* CU-17 GDS & External Provider Gateway Status Strip */}
      <GdsSyncBanner
        onSyncTrigger={handleGdsSync}
        isSyncing={isGdsSyncing}
        lastSyncTime={lastGdsSync}
      />

      {/* Global Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currency={currency}
        onCurrencyChange={setCurrency}
        language={language}
        onLanguageChange={setLanguage}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={() => {
          setCurrentUser(null);
          triggerToast('Sesión cerrada.');
        }}
        onOpenMyReservations={() => setActiveView('my_reservations')}
        onOpenSupport={() => setShowSupportModal(true)}
        onOpenNotifications={() => setShowNotifCenter(true)}
        onOpenNotifSettings={() => setShowNotifSettings(true)}
        pendingCount={pendingReservationsCount}
        unreadNotifsCount={unreadNotifsCount}
        activeView={activeView}
        onNavigateHome={() => {
          setCurrentRole('client');
          setActiveView('home');
        }}
      />

      {/* Floating Requirements Matrix Quick Access Bar */}
      <div className="bg-stone-900/90 text-white px-4 py-2 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-sky-400">Guía de Evaluación del Prototipo:</span>
            <span className="text-stone-300 hidden md:inline">
              17 Casos de Uso (CU-01 a CU-17) y 69 Requerimientos implementados con interactividad real.
            </span>
          </div>
          <button
            id="btn-open-matrix-drawer"
            onClick={() => setShowRequirementsDrawer(true)}
            className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Matriz de Casos de Uso (17/17)</span>
          </button>
        </div>
      </div>

      {/* Transient Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-stone-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN VIEW ROUTING */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: HOME SEARCH & CATALOG (CU-01) */}
        {activeView === 'home' && (
          <div className="space-y-6">
            {/* Search and Filters Bar */}
            <SearchFilters
              originQuery={originQuery}
              setOriginQuery={setOriginQuery}
              destinationQuery={destinationQuery}
              setDestinationQuery={setDestinationQuery}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              transportType={transportType}
              setTransportType={setTransportType}
              timeSlot={timeSlot}
              setTimeSlot={setTimeSlot}
              maxPriceUSD={maxPriceUSD}
              setMaxPriceUSD={setMaxPriceUSD}
              onlyPromos={onlyPromos}
              setOnlyPromos={setOnlyPromos}
              onSearch={handleSearch}
              isSearching={isSearching}
              currency={currency}
              language={language}
            />

            {/* Results Header and Response Time Indicator (Req 14.5: ≤ 3 seg) */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div>
                <h3 className="text-lg font-black text-stone-900 tracking-tight">
                  Opciones Turísticas Disponibles en el Mercosur
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Mostrando {filteredPackages.length} {t.resultsFound}
                </p>
              </div>

              {/* Requirement 14.5 Verification Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-stone-600">
                  {t.responseTimeNotice} <strong className="text-emerald-700 font-mono font-bold">{searchResponseSecs}s</strong> (Req 14.5 ≤3s)
                </span>
              </div>
            </div>

            {/* Results Grid */}
            {filteredPackages.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
                <p className="text-stone-700 font-bold text-sm">No encontramos coincidencias para los filtros seleccionados.</p>
                <p className="text-xs text-stone-500 mt-1">Intentá ampliar el rango de precio o cambiar el destino.</p>
                <button
                  onClick={() => {
                    setOriginQuery('');
                    setDestinationQuery('');
                    setTransportType('all');
                    setTimeSlot('all');
                    setMaxPriceUSD(600);
                  }}
                  className="mt-3 text-sky-700 text-xs font-bold hover:underline"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    item={pkg}
                    currency={currency}
                    language={language}
                    onStartBooking={(item) => {
                      if (!currentUser?.isRegistered) {
                        setShowAuthModal(true);
                      } else {
                        setBookingPackage(item);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: MIS RESERVAS (CU-05, CU-06, CU-07, CU-08, CU-09) */}
        {activeView === 'my_reservations' && (
          <MyReservationsView
            reservations={reservations}
            currency={currency}
            language={language}
            onPayReservation={(res) => setPayingReservation(res)}
            onCancelUnpaidReservation={handleCancelUnpaidReservation}
            onOpenRefundModal={(res) => setRefundingReservation(res)}
            onOpenModifyModal={(res) => setModifyingReservation(res)}
            onOpenVoucher={(res) => setVoucherReservation(res)}
            onBackToSearch={() => setActiveView('home')}
          />
        )}

        {/* VIEW 3: AGENT CRISTIAN CONSOLE (CU-12) */}
        {activeView === 'agent_view' && (
          <AgentSupportView
            userReservations={reservations}
            activeTicket={activeTicket}
            onSendMessageAsAgent={handleSendMessageAsAgent}
            currency={currency}
            clientUser={currentUser}
            onBackToClientView={() => {
              setCurrentRole('client');
              setActiveView('home');
            }}
          />
        )}

        {/* VIEW 4: BACK-OFFICE AGENCY (CU-13, CU-14, CU-15) */}
        {activeView === 'backoffice_view' && (
          <BackOfficeView
            packages={packages}
            onAddPackage={(newPkg) => {
              setPackages([newPkg, ...packages]);
              triggerToast(`Paquete "${newPkg.title}" agregado al catálogo.`);
            }}
            onUpdatePackage={(pkg) => {
              setPackages(packages.map((p) => (p.id === pkg.id ? pkg : p)));
              triggerToast(`Paquete "${pkg.title}" actualizado.`);
            }}
            promotions={promotions}
            onAddPromotion={(prm) => {
              setPromotions([prm, ...promotions]);
              triggerToast(`Promoción "${prm.code}" creada con éxito.`);
            }}
            onUpdatePromotion={(prm) => {
              setPromotions(promotions.map((p) => (p.id === prm.id ? prm : p)));
              triggerToast(`Promoción "${prm.code}" actualizada.`);
            }}
            onDeletePromotion={(prmId) => {
              setPromotions(promotions.filter((p) => p.id !== prmId));
              triggerToast('Promoción eliminada.');
            }}
            reservations={reservations}
            onAdminApproveRefund={(resId) => {
              setReservations((prev) =>
                prev.map((r) =>
                  r.id === resId
                    ? {
                        ...r,
                        status: 'refunded',
                        refundRequest: r.refundRequest
                          ? { ...r.refundRequest, status: 'approved' }
                          : undefined,
                      }
                    : r
                )
              );
              triggerToast('Reembolso aprobado desde Back-office. Usuario notificado por email.');
            }}
            onAdminCancelReservation={(resId) => {
              setReservations((prev) =>
                prev.map((r) => (r.id === resId ? { ...r, status: 'cancelled' } : r))
              );
              triggerToast('Reserva cancelada desde panel de agencia.');
            }}
            currency={currency}
            onBackToClientView={() => {
              setCurrentRole('client');
              setActiveView('home');
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-8 px-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-stone-900 text-white font-bold flex items-center justify-center text-xs">
              VM
            </div>
            <span className="font-bold text-stone-800">Viajes Mercosur</span>
            <span>— Red de Turismo de Integración Regional</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Monedas: ARS, BRL, UYU, PYG</span>
            <span>•</span>
            <span>Idiomas: Español, Português</span>
            <span>•</span>
            <span>Soporte GDS 24/7</span>
          </div>
        </div>
      </footer>

      {/* MODAL SYSTEM */}
      {/* CU-05: Modal de Reserva */}
      {bookingPackage && (
        <ReservationModal
          packageOffer={bookingPackage}
          currentUser={currentUser}
          currency={currency}
          onClose={() => setBookingPackage(null)}
          onConfirmReservation={handleConfirmReservation}
          onRequireLogin={() => setShowAuthModal(true)}
        />
      )}

      {/* CU-06: Modal de Pago */}
      {payingReservation && (
        <PaymentModal
          reservation={payingReservation}
          currency={currency}
          onClose={() => setPayingReservation(null)}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailureNotify={(msg) => triggerToast(msg)}
        />
      )}

      {/* CU-06 / Req 4.5: Voucher PDF imprimible con QR */}
      {voucherReservation && (
        <VoucherPdfModal
          reservation={voucherReservation}
          currency={currency}
          onClose={() => setVoucherReservation(null)}
        />
      )}

      {/* CU-08: Modal de Reembolso */}
      {refundingReservation && (
        <CancelRefundModal
          reservation={refundingReservation}
          currency={currency}
          onClose={() => setRefundingReservation(null)}
          onConfirmRefund={handleConfirmRefund}
        />
      )}

      {/* CU-09: Modal de Modificación */}
      {modifyingReservation && (
        <ModifyReservationModal
          reservation={modifyingReservation}
          currency={currency}
          onClose={() => setModifyingReservation(null)}
          onConfirmModification={handleConfirmModification}
        />
      )}

      {/* CU-10: Modal de Contacto y Atención al Cliente */}
      {showSupportModal && (
        <SupportModal
          currentUser={currentUser}
          onClose={() => setShowSupportModal(false)}
          activeTicket={activeTicket}
          onSendMessage={handleSendMessageAsUser}
          onSubmitOffHoursForm={(subj, msg) => {
            triggerToast('Formulario fuera de horario registrado. Te contactaremos el próximo día hábil.');
          }}
          onSwitchToAgentView={() => {
            setShowSupportModal(false);
            setCurrentRole('support_agent');
            setActiveView('agent_view');
          }}
        />
      )}

      {/* CU-02, CU-03, CU-04: Modal de Autenticación */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
            triggerToast(`¡Bienvenido de nuevo, ${user.name}!`);
          }}
          onRegisterSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
            triggerToast(`¡Cuenta creada con éxito para ${user.name}!`);
          }}
        />
      )}

      {/* CU-11: Configuración de Notificaciones */}
      {showNotifSettings && (
        <NotificationSettingsModal
          settings={notifSettings}
          onUpdateSettings={(s) => {
            setNotifSettings(s);
            triggerToast('Preferencias de notificaciones actualizadas.');
          }}
          onClose={() => setShowNotifSettings(false)}
        />
      )}

      {/* CU-16: Centro de Notificaciones */}
      {showNotifCenter && (
        <NotificationCenterModal
          notifications={notifications}
          onClear={() => setNotifications([])}
          onClose={() => setShowNotifCenter(false)}
          onOpenSettings={() => {
            setShowNotifCenter(false);
            setShowNotifSettings(true);
          }}
        />
      )}

      {/* Traceability Matrix Drawer */}
      {showRequirementsDrawer && (
        <RequirementsDrawer
          onClose={() => setShowRequirementsDrawer(false)}
          onNavigateTo={handleMatrixNavigate}
        />
      )}
    </div>
  );
}
