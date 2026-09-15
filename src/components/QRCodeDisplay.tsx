import React from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

/**
 * Clean SVG QR Code generator simulating a valid boarding pass matrix
 */
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 140 }) => {
  // Generate deterministic grid pattern based on string hash
  const gridSize = 21;
  const hash: number = value.split('').reduce((acc: number, char: string, idx: number) => acc + char.charCodeAt(0) * (idx + 1), 0);

  const isDark = (r: number, c: number) => {
    // 3 Corner finder patterns (7x7)
    if ((r < 7 && c < 7) || (r < 7 && c >= gridSize - 7) || (r >= gridSize - 7 && c < 7)) {
      if (
        (r === 0 || r === 6 || c === 0 || c === 6) ||
        (r >= 2 && r <= 4 && c >= 2 && c <= 4)
      ) {
        return true;
      }
      if (r >= 1 && r <= 5 && c >= 1 && c <= 5) {
        return false;
      }
      return true;
    }

    // Timing patterns
    if (r === 6 || c === 6) {
      return (r + c) % 2 === 0;
    }

    // Pseudo-random data bits based on char code hash
    const bit = (hash * (r * 31 + c * 17 + 13)) % 100;
    return bit > 48;
  };

  const cellSize = size / gridSize;

  return (
    <div className="inline-flex p-3 bg-white rounded-xl shadow-xs border border-stone-200">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#ffffff" />
        {Array.from({ length: gridSize }).map((_, r) =>
          Array.from({ length: gridSize }).map((_, c) => {
            if (isDark(r, c)) {
              return (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize + 0.3}
                  height={cellSize + 0.3}
                  fill="#1c1917"
                />
              );
            }
            return null;
          })
        )}
      </svg>
    </div>
  );
};
