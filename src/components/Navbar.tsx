import React from 'react';
import { Currency, Language, UserProfile, UserRole } from '../types';
import { CURRENCY_RATES } from '../data/mockData';
import { getTranslation } from '../utils/translations';
import { 
  Globe2, 
  Bell, 
  Ticket, 
  Headphones, 
  Building2, 
  UserCheck, 
  Coins, 
  LogOut, 
  LogIn
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  language: Language;
  onLanguageChange: (l: Language) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenMyReservations: () => void;
  onOpenSupport: () => void;
  onOpenNotifications: () => void;
  onOpenNotifSettings: () => void;
  pendingCount: number;
  unreadNotifsCount: number;
  activeView: 'home' | 'my_reservations' | 'agent_view' | 'backoffice_view';
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currency,
  onCurrencyChange,
  language,
  onLanguageChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenMyReservations,
  onOpenSupport,
  onOpenNotifications,
  pendingCount,
  unreadNotifsCount,
  activeView,
  onNavigateHome,
}) => {
  const t = getTranslation(language);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top utility strip: Role switcher & Mercosur scope tag */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-stone-200">Mercosur Travel Network</span>
          <span className="text-stone-500">|</span>
          <span className="hidden sm:inline text-stone-400">Argentina • Brasil • Uruguay • Paraguay</span>
        </div>

        {/* Prototipo Role Switcher (Crucial for testing all user stories!) */}
        <div className="flex items-center gap-1.5 bg-stone-800 p-1 rounded-lg border border-stone-700">
          <span className="text-[11px] text-stone-400 font-semibold uppercase px-1.5 hidden md:inline">
            Rol Prototipo:
          </span>
          <button
            id="role-btn-client"
            onClick={() => onRoleChange('client')}
            className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              currentRole === 'client'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Cliente</span>
          </button>
          <button
            id="role-btn-support"
            onClick={() => onRoleChange('support_agent')}
            className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              currentRole === 'support_agent'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Agente Cristian (CU-12)</span>
          </button>
          <button
            id="role-btn-admin"
            onClick={() => onRoleChange('agency_admin')}
            className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              currentRole === 'agency_admin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Back-office (CU-13/15)</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-sm font-bold text-lg tracking-tight">
            VM
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-stone-900 text-lg tracking-tight">Viajes Mercosur</span>
              <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-1.5 py-0.5 rounded">Prototipo</span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">Agencia de Turismo Regional</p>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector (Req 13.1, 13.2) */}
          <div className="relative flex items-center bg-stone-100 rounded-lg p-1 border border-stone-200 text-xs">
            <Coins className="w-3.5 h-3.5 text-stone-500 ml-1 mr-1 hidden sm:inline" />
            <select
              id="currency-selector"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              aria-label="Seleccionar moneda"
              className="bg-transparent font-semibold text-stone-800 focus:outline-hidden cursor-pointer pr-1"
            >
              {(Object.keys(CURRENCY_RATES) as Currency[]).map((cur) => (
                <option key={cur} value={cur}>
                  {CURRENCY_RATES[cur].symbol} {cur}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector (Req 13.3, 13.4) */}
          <div className="flex items-center bg-stone-100 rounded-lg p-1 border border-stone-200 text-xs font-semibold">
            <Globe2 className="w-3.5 h-3.5 text-stone-500 ml-1 mr-1" />
            <button
              onClick={() => onLanguageChange('es')}
              className={`px-1.5 py-0.5 rounded ${language === 'es' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'}`}
              title="Español"
            >
              ES
            </button>
            <button
              onClick={() => onLanguageChange('pt')}
              className={`px-1.5 py-0.5 rounded ${language === 'pt' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'}`}
              title="Português"
            >
              PT
            </button>
          </div>

          {/* Customer support button (CU-10) */}
          <button
            id="btn-contact-support"
            onClick={onOpenSupport}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors relative"
            title={t.contactAgent}
          >
            <Headphones className="w-5 h-5" />
          </button>

          {/* Notifications button (CU-16) */}
          <button
            id="btn-notifications"
            onClick={onOpenNotifications}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors relative"
            title={t.notificationCenter}
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Mis Reservas Button (CU-05, CU-06, CU-07, CU-08, CU-09) */}
          <button
            id="btn-nav-reservations"
            onClick={onOpenMyReservations}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeView === 'my_reservations'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span className="hidden md:inline">{t.myReservations}</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth button */}
          {currentUser?.isRegistered ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-semibold text-stone-900 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-stone-500">{currentUser.country}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title={t.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-nav-login"
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.login}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
