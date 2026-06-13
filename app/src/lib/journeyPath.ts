// app/src/lib/journeyPath.ts

/** Number of full left-right weaves down the page. */
const WAVES = 2.5;

/** Horizontal centre + amplitude of the weave for a given width. */
function weave(width: number) {
  const isMobile = width < 768;
  const margin = width * (isMobile ? 0.22 : 0.14);
  const center = width / 2;
  const amplitude = (width - margin * 2) / 2;
  return { center, amplitude };
}

/** Horizontal position (px) of the road centre at vertical fraction t (0..1). */
export function roadX(t: number, width: number): number {
  const { center, amplitude } = weave(width);
  return center + Math.sin(t * Math.PI * WAVES) * amplitude;
}

export interface RoadSample {
  x: number;
  y: number;
  /** Degrees, small tilt following the road slope (clamped). */
  angle: number;
  /** Depth scale, subtly smaller on the far swings. */
  scale: number;
}

/** Sample the road at fraction t for placing the van. */
export function sampleRoad(
  t: number,
  width: number,
  height: number,
  padTop = 0,
  padBottom = 0
): RoadSample {
  const clamped = Math.max(0, Math.min(1, t));
  const x = roadX(clamped, width);
  const y = padTop + clamped * (height - padTop - padBottom);

  // Numerical slope for a small, natural tilt.
  const eps = 0.002;
  const x2 = roadX(Math.min(1, clamped + eps), width);
  const dxdy = (x2 - x) / (eps * height);
  const angle = Math.max(-7, Math.min(7, dxdy * 1400));

  // Depth: slightly smaller mid-swing, larger near the ends.
  const scale = 0.88 + 0.12 * Math.abs(Math.cos(clamped * Math.PI * WAVES));

  return { x, y, angle, scale };
}

/** SVG path "d" string for the drawn road across width x height. */
export function getRoadPath(
  width: number,
  height: number,
  padTop = 0,
  padBottom = 0,
  samples = 60
): string {
  let d = '';
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = roadX(t, width).toFixed(1);
    const y = (padTop + t * (height - padTop - padBottom)).toFixed(1);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
}
