import React from 'react';
import { Currency, Language, PackageOffer } from '../types';
import { formatPrice } from '../data/mockData';
import { getTranslation } from '../utils/translations';
import { Plane, Bus, Users, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface PackageCardProps {
  item: PackageOffer;
  currency: Currency;
  language: Language;
  onStartBooking: (item: PackageOffer) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  item,
  currency,
  language,
  onStartBooking,
}) => {
  const t = getTranslation(language);
  const isFlight = item.transportType === 'flight';

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
      {/* Header Image with Tag */}
      <div className="relative h-48 overflow-hidden bg-stone-100">
        <img
          src={item.image}
          alt={item.destinationCity}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-900/20 to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-xs ${
            isFlight ? 'bg-sky-600' : 'bg-amber-600'
          }`}>
            {isFlight ? <Plane className="w-3.5 h-3.5" /> : <Bus className="w-3.5 h-3.5" />}
            <span>{isFlight ? 'Vuelo' : 'Bus Cama'}</span>
          </span>

          {item.isPackage && (
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
              Paquete Completo
            </span>
          )}
        </div>

        {item.promotionTag && (
          <div className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-xs">
            {item.promotionTag}
          </div>
        )}

        {/* Title over image bottom */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs font-medium text-stone-200">{item.carrierName} ({item.carrierCode})</p>
          <h3 className="text-base sm:text-lg font-bold leading-snug drop-shadow-xs">
            {language === 'pt' ? item.titlePt : item.title}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Route details */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 flex items-center justify-between text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400">{t.departure}</p>
              <p className="font-extrabold text-stone-900 text-sm">{item.departureTime}</p>
              <p className="text-stone-600 truncate max-w-[110px]">{item.originCity}</p>
            </div>

            <div className="flex flex-col items-center px-2">
              <span className="text-[10px] font-semibold text-stone-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.duration}
              </span>
              <div className="w-16 h-[2px] bg-stone-300 my-1 relative">
                <div className="w-2 h-2 rounded-full bg-sky-600 absolute right-0 -top-[3px]"></div>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Directo</span>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-stone-400">{t.arrival}</p>
              <p className="font-extrabold text-stone-900 text-sm">{item.arrivalTime}</p>
              <p className="text-stone-600 truncate max-w-[110px]">{item.destinationCity}</p>
            </div>
          </div>

          {/* Package perks if applicable */}
          {item.packageDetails && (
            <div className="text-xs text-stone-600 space-y-1 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
              <p className="font-semibold text-stone-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{item.packageDetails.hotelName} ({item.packageDetails.nights} noches)</span>
              </p>
              {item.packageDetails.excursionIncluded && (
                <p className="text-[11px] text-stone-600 pl-4">
                  Incluye: {item.packageDetails.excursionIncluded}
                </p>
              )}
            </div>
          )}

          {/* Seats Left indicator (Req 1.3) */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="flex items-center gap-1.5 text-stone-600">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>
                <strong className={item.availableSeats < 10 ? 'text-rose-600 font-bold' : 'text-stone-900 font-semibold'}>
                  {item.availableSeats}
                </strong> {t.freeSeats}
              </span>
            </span>
            <span className="text-[11px] text-stone-500 font-medium">
              Fecha: {item.date}
            </span>
          </div>
        </div>

        {/* Pricing & Booking action (Req 2.1) */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
              Precio final por persona
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-stone-900">
                {formatPrice(item.priceUSD, currency)}
              </span>
              <span className="text-[10px] text-stone-400 font-medium">({currency})</span>
            </div>
          </div>

          {/* Botón de inicio de reserva (Req 2.1) */}
          <button
            id={`btn-reserve-${item.id}`}
            onClick={() => onStartBooking(item)}
            className="px-4 py-2 bg-stone-900 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>{t.reserveBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
