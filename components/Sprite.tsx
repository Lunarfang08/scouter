export function Sprite({
  cells,
  ink,
  size = 48,
}: {
  cells: number[];
  ink: string;
  size?: number;
}) {
  const cell = size / 8;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <rect width={size} height={size} fill="#0b0d18" />
      {cells.map((on, i) => {
        const x = (i % 4) * cell;
        const y = Math.floor(i / 4) * cell;
        if (!on) return null;
        return (
          <g key={i}>
            <rect x={x + size / 4} y={y} width={cell} height={cell} fill={ink} />
            <rect
              x={size - cell - x - size / 4}
              y={y}
              width={cell}
              height={cell}
              fill={ink}
            />
          </g>
        );
      })}
    </svg>
  );
}
