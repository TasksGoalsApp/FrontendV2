export function Sparkline({
  data,
  width = 320,
  height = 96,
}: {
  data: number[]
  width?: number
  height?: number
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pad = 6

  const pts = data.map(
    (v, i) =>
      [
        pad + (i / (data.length - 1)) * (width - pad * 2),
        height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2),
      ] as const
  )
  const d = pts
    .map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(' ')
  const last = pts[pts.length - 1]

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="block">
      <path
        d={d}
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={last[0]}
        cy={last[1]}
        r="3.5"
        fill="var(--brand-lime)"
        stroke="var(--card)"
        strokeWidth="2"
      />
    </svg>
  )
}
