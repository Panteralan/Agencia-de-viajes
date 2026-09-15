import React from 'react';
import { TransportType } from '../types';
import { Plane, Bus } from 'lucide-react';

interface SeatMapSelectorProps {
  transportType: TransportType;
  requiredSeats: number;
  selectedSeats: string[];
  onToggleSeat: (seatCode: string) => void;
}

export const SeatMapSelector: React.FC<SeatMapSelectorProps> = ({
  transportType,
  requiredSeats,
  selectedSeats,
  onToggleSeat,
}) => {
  // Predefined occupied seats to make the map realistic
  const occupiedPlaneSeats = new Set(['1A', '1B', '2D', '2E', '4C', '5A', '5B', '6D', '7E', '8F', '10A']);
  const occupiedBusSeats = new Set(['1', '2', '5', '9', '12', '15', '18', '22']);

  const isPlane = transportType === 'flight';

  // Plane layout: rows 1 to 8, columns A, B, C (Aisle) D, E, F
  const planeRows = [1, 2, 3, 4, 5, 6, 7, 8];
  const planeLeftCols = ['A', 'B', 'C'];
  const planeRightCols = ['D', 'E', 'F'];

  // Bus layout: rows 1 to 7, columns 1, 2 (Aisle) 3, 4
  const busRows = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 my-4">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          {isPlane ? <Plane className="w-5 h-5 text-sky-600" /> : <Bus className="w-5 h-5 text-amber-600" />}
          <h4 className="font-semibold text-stone-900 text-sm">
            {isPlane ? 'Mapa de Cabina de Avión (Mercosur Jet)' : 'Mapa de Asientos de Bus Cama'}
          </h4>
        </div>
        <div className="text-xs font-medium text-stone-600">
          Seleccionados: <span className="text-sky-700 font-bold">{selectedSeats.length}</span> de <span className="font-bold">{requiredSeats}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-600 mb-4 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-sm bg-white border-2 border-stone-300"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-sm bg-sky-600 border border-sky-700 text-white flex items-center justify-center text-[10px]">✓</div>
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-sm bg-stone-200 border border-stone-300 text-stone-400 flex items-center justify-center text-[10px]">✕</div>
          <span>Ocupado</span>
        </div>
      </div>

      {/* Visual cabin */}
      <div className="max-w-md mx-auto bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        {isPlane ? (
          <div>
            {/* Cockpit Indicator */}
            <div className="text-center pb-3 mb-3 border-b border-dashed border-stone-300">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-400">▲ Cabina de Pilotos / Proa ▲</span>
            </div>

            <div className="space-y-2">
              {planeRows.map((row) => (
                <div key={row} className="flex items-center justify-between gap-1">
                  {/* Left seats */}
                  <div className="flex gap-1.5">
                    {planeLeftCols.map((col) => {
                      const code = `${row}${col}`;
                      const isOccupied = occupiedPlaneSeats.has(code);
                      const isSelected = selectedSeats.includes(code);
                      return (
                        <button
                          key={code}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => onToggleSeat(code)}
                          className={`w-8 h-8 text-xs font-semibold rounded-md transition-colors flex items-center justify-center ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-xs font-bold'
                              : isOccupied
                              ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                              : 'bg-white text-stone-700 border border-stone-300 hover:border-sky-500 hover:bg-sky-50'
                          }`}
                        >
                          {code}
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle */}
                  <span className="text-[10px] text-stone-400 font-mono w-5 text-center">{row}</span>

                  {/* Right seats */}
                  <div className="flex gap-1.5">
                    {planeRightCols.map((col) => {
                      const code = `${row}${col}`;
                      const isOccupied = occupiedPlaneSeats.has(code);
                      const isSelected = selectedSeats.includes(code);
                      return (
                        <button
                          key={code}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => onToggleSeat(code)}
                          className={`w-8 h-8 text-xs font-semibold rounded-md transition-colors flex items-center justify-center ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-xs font-bold'
                              : isOccupied
                              ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                              : 'bg-white text-stone-700 border border-stone-300 hover:border-sky-500 hover:bg-sky-50'
                          }`}
                        >
                          {code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Bus front */}
            <div className="text-center pb-3 mb-3 border-b border-dashed border-stone-300 flex items-center justify-between px-2">
              <span className="text-[11px] font-semibold text-stone-400">Puerta Delantera</span>
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">▲ Conductor ▲</span>
            </div>

            <div className="space-y-2">
              {busRows.map((row) => {
                const s1 = `${(row - 1) * 4 + 1}`;
                const s2 = `${(row - 1) * 4 + 2}`;
                const s3 = `${(row - 1) * 4 + 3}`;
                const s4 = `${(row - 1) * 4 + 4}`;

                const renderBusSeat = (code: string) => {
                  const isOccupied = occupiedBusSeats.has(code);
                  const isSelected = selectedSeats.includes(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => onToggleSeat(code)}
                      className={`w-9 h-8 text-xs font-semibold rounded-md transition-colors flex items-center justify-center ${
                        isSelected
                          ? 'bg-amber-600 text-white shadow-xs font-bold'
                          : isOccupied
                          ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                          : 'bg-white text-stone-700 border border-stone-300 hover:border-amber-500 hover:bg-amber-50'
                      }`}
                    >
                      {code}
                    </button>
                  );
                };

                return (
                  <div key={row} className="flex items-center justify-between gap-1">
                    <div className="flex gap-2">
                      {renderBusSeat(s1)}
                      {renderBusSeat(s2)}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono w-5 text-center">F{row}</span>
                    <div className="flex gap-2">
                      {renderBusSeat(s3)}
                      {renderBusSeat(s4)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-4 p-2.5 bg-sky-50/80 border border-sky-200 rounded-lg text-xs text-sky-900 flex items-center justify-between">
          <span>Asientos elegidos: <strong className="font-semibold">{selectedSeats.join(', ')}</strong></span>
          {selectedSeats.length !== requiredSeats && (
            <span className="text-amber-700 font-medium">
              Faltan {requiredSeats - selectedSeats.length} asiento(s)
            </span>
          )}
        </div>
      )}
    </div>
  );
};
