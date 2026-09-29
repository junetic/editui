import type { CSSProperties } from 'react';
import { boundsStyle } from '../lib/geometry';
import type { Bounds } from '../lib/types';

interface OutlineProps {
  bounds: Bounds;
  pulsed?: boolean;
  selected?: boolean;
}

export function Outline({ bounds, pulsed = false, selected = false }: OutlineProps) {
  const className = ['outline', pulsed ? 'pulse' : '', selected ? 'selected' : ''].filter(Boolean).join(' ');
  return <div className={className} style={boundsStyle(bounds)} />;
}

interface HoverBoxProps {
  bounds: Bounds;
  label: string;
}

export function HoverBox({ bounds, label }: HoverBoxProps) {
  const top = bounds.y > 26 ? bounds.y - 22 : bounds.y + 4;
  const style: CSSProperties = { left: bounds.x, top };
  return (
    <>
      <Outline bounds={bounds} />
      <div className="tag" style={style}>
        {label}
      </div>
    </>
  );
}
