export function markerGlyph(index: number): string {
  return String(index + 1);
}

interface MarkersProps {
  markers: Array<{
    id: string;
    index: number;
    bounds: { x: number; y: number; width: number; height: number };
    changed: boolean;
    hot: boolean;
    selected: boolean;
  }>;
  onOpen: (id: string) => void;
}

export function Markers({ markers, onOpen }: MarkersProps) {
  return (
    <>
      {markers.map((marker) => (
        <button
          key={marker.id}
          type="button"
          className={markerClass(marker)}
          style={{ left: marker.bounds.x, top: marker.bounds.y }}
          data-editui="marker"
          aria-label={marker.changed ? `Edit ${marker.index + 1}, element changed` : `Edit ${marker.index + 1}`}
          title={marker.changed ? 'Element changed' : `Edit ${marker.index + 1}`}
          onClick={() => onOpen(marker.id)}
        >
          {markerGlyph(marker.index)}
        </button>
      ))}
    </>
  );
}

function markerClass(marker: { changed: boolean; hot: boolean; selected: boolean }): string {
  const names = ['marker', 'interactive'];
  if (marker.changed) names.push('changed');
  if (marker.hot) names.push('hot');
  if (marker.selected) names.push('selected');
  return names.join(' ');
}
