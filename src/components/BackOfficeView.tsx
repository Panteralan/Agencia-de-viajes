import React, { useState } from 'react';
import { Currency, PackageOffer, Promotion, Reservation } from '../types';
import { formatPrice } from '../data/mockData';
import { 
  Building2, 
  Package, 
  Tag, 
  Ticket, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  RefreshCw, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle,
  Plane,
  Bus,
  ArrowLeft
} from 'lucide-react';

interface BackOfficeViewProps {
  packages: PackageOffer[];
  onAddPackage: (newPkg: PackageOffer) => void;
  onUpdatePackage: (pkg: PackageOffer) => void;
  promotions: Promotion[];
  onAddPromotion: (prm: Promotion) => void;
  onUpdatePromotion: (prm: Promotion) => void;
  onDeletePromotion: (prmId: string) => void;
  reservations: Reservation[];
  onAdminApproveRefund: (resId: string) => void;
  onAdminCancelReservation: (resId: string) => void;
  currency: Currency;
  onBackToClientView: () => void;
}

export const BackOfficeView: React.FC<BackOfficeViewProps> = ({
  packages,
  onAddPackage,
  onUpdatePackage,
  promotions,
  onAddPromotion,
  onUpdatePromotion,
  onDeletePromotion,
  reservations,
  onAdminApproveRefund,
  onAdminCancelReservation,
  currency,
  onBackToClientView,
}) => {
  const [tab, setTab] = useState<'packages' | 'promos' | 'reservations'>('packages');

  // Package modal state
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageOffer | null>(null);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgOrigin, setPkgOrigin] = useState('Buenos Aires');
  const [pkgDestination, setPkgDestination] = useState('Río de Janeiro');
  const [pkgTransport, setPkgTransport] = useState<'flight' | 'bus'>('flight');
  const [pkgCarrier, setPkgCarrier] = useState('Aerolíneas Argentinas');
  const [pkgPriceUSD, setPkgPriceUSD] = useState(350);
  const [pkgSeats, setPkgSeats] = useState(40);
  const [pkgDate, setPkgDate] = useState('2026-11-15');

  // Promo modal state
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(15);
  const [promoDest, setPromoDest] = useState('all');

  const openAddPkg = () => {
    setEditingPkg(null);
    setPkgTitle('');
    setPkgOrigin('Buenos Aires');
    setPkgDestination('Río de Janeiro');
    setPkgTransport('flight');
    setPkgCarrier('Aerolíneas Argentinas');
    setPkgPriceUSD(350);
    setPkgSeats(40);
    setPkgDate('2026-11-15');
    setShowPkgModal(true);
  };

  const openEditPkg = (pkg: PackageOffer) => {
    setEditingPkg(pkg);
    setPkgTitle(pkg.title);
    setPkgOrigin(pkg.originCity);
    setPkgDestination(pkg.destinationCity);
    setPkgTransport(pkg.transportType);
    setPkgCarrier(pkg.carrierName);
    setPkgPriceUSD(pkg.priceUSD);
    setPkgSeats(pkg.availableSeats);
    setPkgDate(pkg.date);
    setShowPkgModal(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPkg) {
      const updated: PackageOffer = {
        ...editingPkg,
        title: pkgTitle,
        titlePt: pkgTitle,
        originCity: pkgOrigin,
        origin: `${pkgOrigin} Centro`,
        destinationCity: pkgDestination,
        destination: `${pkgDestination} Centro`,
        transportType: pkgTransport,
        carrierName: pkgCarrier,
        priceUSD: Number(pkgPriceUSD),
        availableSeats: Number(pkgSeats),
        date: pkgDate,
      };
      onUpdatePackage(updated);
    } else {
      const created: PackageOffer = {
        id: `pkg-${Date.now()}`,
        code: `VM-NEW-${Math.floor(100 + Math.random() * 900)}`,
        title: pkgTitle || `Escapada a ${pkgDestination}`,
        titlePt: pkgTitle || `Escapada para ${pkgDestination}`,
        origin: `${pkgOrigin} Terminal`,
        originCity: pkgOrigin,
        destination: `${pkgDestination} Destino`,
        destinationCity: pkgDestination,
        destinationCountry: 'Brasil',
        transportType: pkgTransport,
        carrierName: pkgCarrier,
        carrierCode: 'AR-771',
        departureTime: '08:30',
        arrivalTime: '11:45',
        timeSlot: 'morning',
        duration: '3h 15m',
        date: pkgDate,
        priceUSD: Number(pkgPriceUSD),
        availableSeats: Number(pkgSeats),
        totalSeats: Number(pkgSeats) + 20,
        isPackage: true,
        packageDetails: {
          hotelName: 'Hotel 4★ Mercosur Central',
          hotelStars: 4,
          nights: 4,
          includesBreakfast: true,
          transfersIncluded: true,
        },
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      };
      onAddPackage(created);
    }
    setShowPkgModal(false);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode || !promoTitle) return;
    const newPromo: Promotion = {
      id: `prm-${Date.now()}`,
      code: promoCode.toUpperCase().replace(/\s+/g, ''),
      title: promoTitle,
      titlePt: promoTitle,
      discountPercent: Number(promoDiscount),
      applicableDestinations: promoDest === 'all' ? ['all'] : [promoDest],
      validUntil: '2026-12-31',
      active: true,
    };
    onAddPromotion(newPromo);
    setShowPromoModal(false);
    setPromoCode('');
    setPromoTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
        <div>
          <button
            onClick={onBackToClientView}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Vista del Viajero</span>
          </button>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Panel Back-office de la Agencia
            </h1>
            <span className="text-xs bg-indigo-100 text-indigo-900 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
              CU-13, CU-14, CU-15
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gestión integral de ofertas, promociones con descuento y administración de reservas entrantes y cancelaciones.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
          <button
            id="tab-admin-packages"
            onClick={() => setTab('packages')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              tab === 'packages' ? 'bg-indigo-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Paquetes y Vuelos (CU-13)</span>
          </button>

          <button
            id="tab-admin-promos"
            onClick={() => setTab('promos')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              tab === 'promos' ? 'bg-indigo-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promociones (CU-14)</span>
          </button>

          <button
            id="tab-admin-reservations"
            onClick={() => setTab('reservations')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              tab === 'reservations' ? 'bg-indigo-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Reservas y Reembolsos (CU-15)</span>
            <span className="ml-1 bg-white/20 px-1.5 rounded-full text-[10px]">
              {reservations.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: GESTIÓN DE PAQUETES Y OFERTAS TURÍSTICAS (CU-13, Req 15.1, 15.2) */}
      {tab === 'packages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-stone-900 text-base">
              Catálogo de Vuelos y Paquetes Turísticos ({packages.length})
            </h3>
            <button
              id="btn-add-package"
              onClick={openAddPkg}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Cargar Nuevo Paquete (Req 15.1)</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">Código</th>
                  <th className="p-3">Título / Oferta</th>
                  <th className="p-3">Ruta</th>
                  <th className="p-3">Transporte</th>
                  <th className="p-3">Operador</th>
                  <th className="p-3">Precio USD</th>
                  <th className="p-3">Asientos Libres</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-stone-50">
                    <td className="p-3 font-mono font-bold text-stone-500">{pkg.code}</td>
                    <td className="p-3 font-bold text-stone-900">{pkg.title}</td>
                    <td className="p-3 text-stone-600">{pkg.originCity} → {pkg.destinationCity}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        pkg.transportType === 'flight' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pkg.transportType === 'flight' ? <Plane className="w-3 h-3" /> : <Bus className="w-3 h-3" />}
                        <span>{pkg.transportType === 'flight' ? 'Avión' : 'Bus'}</span>
                      </span>
                    </td>
                    <td className="p-3 text-stone-600">{pkg.carrierName}</td>
                    <td className="p-3 font-extrabold text-stone-900">${pkg.priceUSD}</td>
                    <td className="p-3">
                      <span className="font-semibold text-emerald-700">{pkg.availableSeats}</span> / {pkg.totalSeats}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openEditPkg(pkg)}
                        className="p-1.5 text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Actualizar paquete (Req 15.2)"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GESTIÓN DE PROMOCIONES (CU-14, Req 15.3, 15.4, 15.5) */}
      {tab === 'promos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-stone-900 text-base">
              Promociones y Descuentos Comerciales ({promotions.length})
            </h3>
            <button
              id="btn-add-promo"
              onClick={() => setShowPromoModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Promoción (Req 15.3)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promotions.map((prm) => (
              <div
                key={prm.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-xs">
                      {prm.code}
                    </span>
                    <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {prm.discountPercent}% OFF
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">{prm.title}</h4>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Destinos: {prm.applicableDestinations.join(', ')}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    Vigencia hasta: {prm.validUntil}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prm.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                    {prm.active ? 'Activa' : 'Pausada'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdatePromotion({ ...prm, active: !prm.active })}
                      className="p-1.5 text-stone-500 hover:text-indigo-600 rounded-lg"
                      title="Activar / Desactivar (Req 15.4)"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeletePromotion(prm.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                      title="Eliminar promoción (Req 15.5)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GESTIÓN DE RESERVAS Y CANCELACIONES (CU-15, Req 15.6, 15.7, 15.8) */}
      {tab === 'reservations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-stone-900 text-base">
              Reservas y Solicitudes de Cancelación Entrantes (CU-15)
            </h3>
            <span className="text-xs text-stone-500">
              Total Registradas: <strong>{reservations.length}</strong>
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">Código</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Paquete / Vuelo</th>
                  <th className="p-3">Fecha y Asientos</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Gestión (Back-office)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reservations.map((res) => {
                  const isRefundReq = res.status === 'refund_requested';
                  return (
                    <tr key={res.id} className={`hover:bg-stone-50 ${isRefundReq ? 'bg-purple-50/50' : ''}`}>
                      <td className="p-3 font-mono font-bold text-stone-900">#{res.bookingCode}</td>
                      <td className="p-3">
                        <span className="font-bold text-stone-900 block">{res.userName}</span>
                        <span className="text-[10px] text-stone-400">{res.userEmail}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-stone-800 block">{res.packageSnapshot.title}</span>
                        <span className="text-[10px] text-stone-500">{res.packageSnapshot.carrierName}</span>
                      </td>
                      <td className="p-3">
                        <span>{res.travelDate}</span>
                        <span className="block font-mono text-sky-700 font-bold">{res.seatCodes.join(', ')}</span>
                      </td>
                      <td className="p-3 font-extrabold text-stone-900">
                        {formatPrice(res.totalAmountUSD, currency)}
                      </td>
                      <td className="p-3">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          res.status === 'confirmed_paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : res.status === 'pending_payment'
                            ? 'bg-amber-100 text-amber-900'
                            : res.status === 'refund_requested'
                            ? 'bg-purple-100 text-purple-900 font-black animate-pulse'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {res.status === 'refund_requested' ? 'Reembolso Solicitado' : res.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        {isRefundReq && (
                          <button
                            onClick={() => onAdminApproveRefund(res.id)}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors"
                            title="Aprobar reembolso según regla de negocio (Req 15.8)"
                          >
                            Aprobar Reembolso
                          </button>
                        )}
                        {res.status !== 'cancelled' && res.status !== 'refunded' && (
                          <button
                            onClick={() => onAdminCancelReservation(res.id)}
                            className="px-2 py-1 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 rounded-lg text-[10px] font-medium border border-stone-200"
                            title="Cancelar reserva desde back-office (Req 15.8)"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PACKAGE (Req 15.1, 15.2) */}
      {showPkgModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h4 className="font-extrabold text-stone-900 text-base">
                {editingPkg ? 'Actualizar Paquete / Vuelo (Req 15.2)' : 'Cargar Nuevo Paquete (Req 15.1)'}
              </h4>
              <button onClick={() => setShowPkgModal(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Título de la Oferta</label>
                <input
                  type="text"
                  required
                  value={pkgTitle}
                  onChange={(e) => setPkgTitle(e.target.value)}
                  placeholder="Ej. Escapada a Río de Janeiro con Hotel 4★"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Ciudad Origen</label>
                  <input
                    type="text"
                    value={pkgOrigin}
                    onChange={(e) => setPkgOrigin(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Ciudad Destino</label>
                  <input
                    type="text"
                    value={pkgDestination}
                    onChange={(e) => setPkgDestination(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Transporte</label>
                  <select
                    value={pkgTransport}
                    onChange={(e) => setPkgTransport(e.target.value as 'flight' | 'bus')}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="flight">Vuelo Comercial ✈️</option>
                    <option value="bus">Bus de Larga Distancia 🚌</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Empresa / Carrier</label>
                  <input
                    type="text"
                    value={pkgCarrier}
                    onChange={(e) => setPkgCarrier(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Precio USD</label>
                  <input
                    type="number"
                    value={pkgPriceUSD}
                    onChange={(e) => setPkgPriceUSD(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Asientos</label>
                  <input
                    type="number"
                    value={pkgSeats}
                    onChange={(e) => setPkgSeats(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Fecha</label>
                  <input
                    type="date"
                    value={pkgDate}
                    onChange={(e) => setPkgDate(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPkgModal(false)}
                  className="px-4 py-2 text-stone-500 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Guardar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PROMOTION (Req 15.3) */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h4 className="font-extrabold text-stone-900 text-base">
                Crear Nueva Promoción (Req 15.3)
              </h4>
              <button onClick={() => setShowPromoModal(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Código Promocional</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. VERANOMERCOSUR"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full p-2.5 font-mono uppercase bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Descripción de la Promoción</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 20% OFF en escapadas a Florianópolis"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Descuento (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Destino Aplicable</label>
                  <select
                    value={promoDest}
                    onChange={(e) => setPromoDest(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="all">Todos los destinos</option>
                    <option value="Río de Janeiro">Río de Janeiro</option>
                    <option value="Florianópolis">Florianópolis</option>
                    <option value="Cataratas de Iguazú">Cataratas de Iguazú</option>
                    <option value="Bariloche">Bariloche</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2 text-stone-500 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Publicar Promoción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
