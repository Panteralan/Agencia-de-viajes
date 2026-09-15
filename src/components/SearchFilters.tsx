import React from 'react';
import { Currency, Language, TimeOfDay, TransportType } from '../types';
import { getTranslation } from '../utils/translations';
import { formatPrice } from '../data/mockData';
import { Search, Plane, Bus, Clock, Calendar, MapPin, Tag } from 'lucide-react';

interface SearchFiltersProps {
  originQuery: string;
  setOriginQuery: (v: string) => void;
  destinationQuery: string;
  setDestinationQuery: (v: string) => void;
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  transportType: TransportType | 'all';
  setTransportType: (v: TransportType | 'all') => void;
  timeSlot: TimeOfDay;
  setTimeSlot: (v: TimeOfDay) => void;
  maxPriceUSD: number;
  setMaxPriceUSD: (v: number) => void;
  onlyPromos: boolean;
  setOnlyPromos: (v: boolean) => void;
  onSearch: () => void;
  isSearching: boolean;
  currency: Currency;
  language: Language;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  originQuery,
  setOriginQuery,
  destinationQuery,
  setDestinationQuery,
  selectedDate,
  setSelectedDate,
  transportType,
  setTransportType,
  timeSlot,
  setTimeSlot,
  maxPriceUSD,
  setMaxPriceUSD,
  onlyPromos,
  setOnlyPromos,
  onSearch,
  isSearching,
  currency,
  language,
}) => {
  const t = getTranslation(language);

  const quickDestinations = [
    'Río de Janeiro',
    'Buenos Aires',
    'Cataratas de Iguazú',
    'Montevideo',
    'Florianópolis',
    'Bariloche',
    'Punta del Este',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 sm:p-6 mb-8">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
          {t.searchTitle}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {t.searchSubtitle}
        </p>
      </div>

      {/* Main Search Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
        {/* Origin */}
        <div className="md:col-span-3 relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Origen
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              id="input-origin"
              type="text"
              value={originQuery}
              onChange={(e) => setOriginQuery(e.target.value)}
              placeholder={t.originPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* Destination */}
        <div className="md:col-span-4 relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Destino Mercosur
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-sky-600 absolute left-3 top-3" />
            <input
              id="input-destination"
              type="text"
              value={destinationQuery}
              onChange={(e) => setDestinationQuery(e.target.value)}
              placeholder={t.destPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-colors font-medium"
            />
          </div>
        </div>

        {/* Date */}
        <div className="md:col-span-3 relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            {t.searchDate}
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              id="input-travel-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* Search button (CU-01 flow step 2 -> 3) */}
        <div className="md:col-span-2 flex items-end">
          <button
            id="btn-submit-search"
            onClick={onSearch}
            disabled={isSearching}
            className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-75"
          >
            <Search className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
            <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
          </button>
        </div>
      </div>

      {/* Quick destination chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs">
        <span className="text-stone-400 font-medium">Destinos populares:</span>
        {quickDestinations.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setDestinationQuery(city)}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors font-medium text-[11px]"
          >
            {city}
          </button>
        ))}
      </div>

      {/* Secondary Filters: Transport Type & Schedule (Req 1.4, 1.5) */}
      <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
        {/* Transport Type Filter (Req 1.5) */}
        <div className="lg:col-span-4">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
            Tipo de Transporte
          </span>
          <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 w-full">
            <button
              type="button"
              onClick={() => setTransportType('all')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors text-center ${
                transportType === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setTransportType('flight')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                transportType === 'flight'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Avión</span>
            </button>
            <button
              type="button"
              onClick={() => setTransportType('bus')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                transportType === 'bus'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Bus</span>
            </button>
          </div>
        </div>

        {/* Schedule Filter (Req 1.4) */}
        <div className="lg:col-span-4">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
            Horario de Salida
          </span>
          <div className="relative">
            <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <select
              id="filter-timeslot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value as TimeOfDay)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-stone-800 font-medium cursor-pointer"
            >
              <option value="all">{t.timeSlotAll}</option>
              <option value="morning">{t.timeSlotMorning}</option>
              <option value="afternoon">{t.timeSlotAfternoon}</option>
              <option value="night">{t.timeSlotNight}</option>
            </select>
          </div>
        </div>

        {/* Max Price and Promos Filter (Req 1.1, 1.2) */}
        <div className="lg:col-span-4 flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-stone-600 font-medium mb-1">
              <span>{t.maxPrice}</span>
              <strong className="text-stone-900 font-bold">
                {formatPrice(maxPriceUSD, currency)}
              </strong>
            </div>
            <input
              type="range"
              min="100"
              max="700"
              step="20"
              value={maxPriceUSD}
              onChange={(e) => setMaxPriceUSD(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
            />
          </div>

          <button
            type="button"
            onClick={() => setOnlyPromos(!onlyPromos)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              onlyPromos
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Promos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
