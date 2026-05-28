import type { BorderConfig, BorderStyle } from '../../types';

interface BorderConfiguratorProps {
  borderConfig: BorderConfig;
  setBorderConfig: (config: BorderConfig) => void;
}

const borderStyles: { value: BorderStyle; label: string; category: 'basic' | 'ornamental' }[] = [
  { value: 'none', label: 'None', category: 'basic' },
  { value: 'solid', label: 'Solid', category: 'basic' },
  { value: 'double', label: 'Double', category: 'basic' },
  { value: 'dashed', label: 'Dashed', category: 'basic' },
  { value: 'dotted', label: 'Dotted', category: 'basic' },
  { value: 'groove', label: 'Groove', category: 'basic' },
  { value: 'ridge', label: 'Ridge', category: 'basic' },
  { value: 'inset', label: 'Inset', category: 'basic' },
  { value: 'outset', label: 'Outset', category: 'basic' },
  { value: 'ornamental-classic', label: 'Classic Ornamental', category: 'ornamental' },
  { value: 'ornamental-floral', label: 'Floral', category: 'ornamental' },
  { value: 'ornamental-greek', label: 'Greek Key', category: 'ornamental' },
  { value: 'ornamental-celtic', label: 'Celtic Knot', category: 'ornamental' },
  { value: 'ornamental-art-deco', label: 'Art Deco', category: 'ornamental' },
  { value: 'ornamental-royal', label: 'Royal', category: 'ornamental' },
  { value: 'ornamental-simple-elegant', label: 'Simple Elegant', category: 'ornamental' },
  { value: 'ornamental-wave', label: 'Wave', category: 'ornamental' },
];

const colorPresets = ['#b8860b', '#1a1a1a', '#1e40af', '#15803d', '#7c2d12', '#6b21a8', '#be123c', '#64748b'];

const DEFAULT_BORDER: BorderConfig = {
  style: 'none',
  width: 3,
  color: '#b8860b',
  radius: 0,
  inset: 2,
  opacity: 1,
};

/** Merges partial / API `borderConfig` so `style` and numeric fields are always defined. */
export function normalizeBorderConfig(input?: Partial<BorderConfig> | null): BorderConfig {
  if (!input) {
    return { ...DEFAULT_BORDER };
  }
  return {
    ...DEFAULT_BORDER,
    ...input,
    style: input.style ?? DEFAULT_BORDER.style,
    width: typeof input.width === 'number' && !Number.isNaN(input.width) ? input.width : DEFAULT_BORDER.width,
    color: typeof input.color === 'string' && input.color.length > 0 ? input.color : DEFAULT_BORDER.color,
    radius: typeof input.radius === 'number' && !Number.isNaN(input.radius) ? input.radius : DEFAULT_BORDER.radius,
    inset: typeof input.inset === 'number' && !Number.isNaN(input.inset) ? input.inset : DEFAULT_BORDER.inset,
    opacity: typeof input.opacity === 'number' && !Number.isNaN(input.opacity) ? input.opacity : DEFAULT_BORDER.opacity,
  };
}

export function BorderConfigurator({ borderConfig, setBorderConfig }: BorderConfiguratorProps) {
  const bc = normalizeBorderConfig(borderConfig);
  const update = (partial: Partial<BorderConfig>) => {
    setBorderConfig(normalizeBorderConfig({ ...borderConfig, ...partial }));
  };

  const basicStyles = borderStyles.filter((s) => s.category === 'basic');
  const ornamentalStyles = borderStyles.filter((s) => s.category === 'ornamental');

  return (
    <div className="card cert-border-config">
      <h3 className="cert-border-config__title">Border Style</h3>
      <p className="cert-border-config__help">
        Customize the certificate border. Choose from basic CSS borders or ornamental patterns.
      </p>

      <div className="cert-border-config__stack">
        <div>
          <p className="cert-border-config__section-label">Basic Borders</p>
          <div className="cert-border-config__grid">
            {basicStyles.map((s) => (
              <button
                type="button"
                key={s.value}
                onClick={() => update({ style: s.value })}
                className={`cert-border-config__swatch${bc.style === s.value ? ' cert-border-config__swatch--selected' : ''}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="cert-border-config__section-label">Ornamental Borders</p>
          <div className="cert-border-config__grid cert-border-config__grid--ornate">
            {ornamentalStyles.map((s) => (
              <button
                type="button"
                key={s.value}
                onClick={() => update({ style: s.value })}
                className={`cert-border-config__swatch${bc.style === s.value ? ' cert-border-config__swatch--selected' : ''}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {bc.style !== 'none' && (
        <div className="cert-border-config__controls">
          <div>
            <span className="cert-border-config__label">Border Color</span>
            <div className="cert-border-config__color-row">
              <input
                type="color"
                value={bc.color}
                onChange={(e) => update({ color: e.target.value })}
                className="cert-border-config__color-input"
              />
              <input
                type="text"
                value={bc.color}
                onChange={(e) => update({ color: e.target.value })}
                className="input-field cert-border-config__mono"
              />
              <div className="cert-border-config__preset-row">
                {colorPresets.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => update({ color: c })}
                    className={`cert-border-config__preset${bc.color === c ? ' cert-border-config__preset--selected' : ''}`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="cert-border-config__label" htmlFor="cert-border-width">
              Width: {bc.width}px
            </label>
            <input
              id="cert-border-width"
              type="range"
              min={1}
              max={20}
              value={bc.width}
              onChange={(e) => update({ width: Number(e.target.value) })}
              className="cert-border-config__range form-range"
            />
          </div>

          <div>
            <label className="cert-border-config__label" htmlFor="cert-border-inset">
              Inset (margin from edge): {bc.inset}%
            </label>
            <input
              id="cert-border-inset"
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={bc.inset}
              onChange={(e) => update({ inset: Number(e.target.value) })}
              className="cert-border-config__range form-range"
            />
          </div>

          <div>
            <label className="cert-border-config__label" htmlFor="cert-border-radius">
              Corner Radius: {bc.radius}px
            </label>
            <input
              id="cert-border-radius"
              type="range"
              min={0}
              max={30}
              value={bc.radius}
              onChange={(e) => update({ radius: Number(e.target.value) })}
              className="cert-border-config__range form-range"
            />
          </div>

          <div>
            <label className="cert-border-config__label" htmlFor="cert-border-opacity">
              Opacity: {Math.round(bc.opacity * 100)}%
            </label>
            <input
              id="cert-border-opacity"
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={bc.opacity}
              onChange={(e) => update({ opacity: Number(e.target.value) })}
              className="cert-border-config__range form-range"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Renders the border on the certificate based on BorderConfig.
 * Used in both the preview panel and the template preview page.
 */
export function CertificateBorder({ config, className = '' }: { config: BorderConfig; className?: string }) {
  const c = normalizeBorderConfig(config);
  if (c.style === 'none') return null;

  const isOrnamental = c.style.startsWith('ornamental-');

  if (!isOrnamental) {
    // Standard CSS border
    return (
      <div
        className={`cert-border-abs ${className}`}
        style={{
          inset: `${c.inset}%`,
          border: `${c.width}px ${c.style} ${c.color}`,
          borderRadius: `${c.radius}px`,
          opacity: c.opacity,
        }}
      />
    );
  }

  // Ornamental SVG borders
  const pattern = getOrnamentalPattern(c.style, c.color);

  return (
    <div
      className={`cert-border-abs ${className}`}
      style={{
        inset: `${c.inset}%`,
        borderRadius: `${c.radius}px`,
        opacity: c.opacity,
      }}
    >
      <svg
        className="cert-border-svg"
        viewBox="0 0 400 283"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`border-pattern-${c.style}`} patternUnits="userSpaceOnUse" width={pattern.size} height={pattern.size}>
            <path d={pattern.path} fill="none" stroke={c.color} strokeWidth={c.width * 0.3} />
          </pattern>
        </defs>
        {/* Top border */}
        <rect x={c.width} y="0" width={400 - c.width * 2} height={c.width * 2} fill={`url(#border-pattern-${c.style})`} />
        {/* Bottom border */}
        <rect x={c.width} y={283 - c.width * 2} width={400 - c.width * 2} height={c.width * 2} fill={`url(#border-pattern-${c.style})`} />
        {/* Left border */}
        <rect x="0" y={c.width} width={c.width * 2} height={283 - c.width * 2} fill={`url(#border-pattern-${c.style})`} />
        {/* Right border */}
        <rect x={400 - c.width * 2} y={c.width} width={c.width * 2} height={283 - c.width * 2} fill={`url(#border-pattern-${c.style})`} />
        {/* Corner accents */}
        <circle cx={c.width * 2} cy={c.width * 2} r={c.width * 1.5} fill="none" stroke={c.color} strokeWidth={c.width * 0.4} />
        <circle cx={400 - c.width * 2} cy={c.width * 2} r={c.width * 1.5} fill="none" stroke={c.color} strokeWidth={c.width * 0.4} />
        <circle cx={c.width * 2} cy={283 - c.width * 2} r={c.width * 1.5} fill="none" stroke={c.color} strokeWidth={c.width * 0.4} />
        <circle cx={400 - c.width * 2} cy={283 - c.width * 2} r={c.width * 1.5} fill="none" stroke={c.color} strokeWidth={c.width * 0.4} />
      </svg>
    </div>
  );
}

function getOrnamentalPattern(style: string, _color: string): { path: string; size: number } {
  switch (style) {
    case 'ornamental-classic':
      return { path: 'M0,5 C2.5,0 7.5,0 10,5 C12.5,10 17.5,10 20,5', size: 20 };
    case 'ornamental-floral':
      return { path: 'M5,0 Q10,5 5,10 Q0,5 5,0 M15,0 Q20,5 15,10 Q10,5 15,0', size: 20 };
    case 'ornamental-greek':
      return { path: 'M0,0 L5,0 L5,5 L10,5 L10,0 L15,0 L15,10 L10,10 L10,5 L5,5 L5,10 L0,10 Z', size: 15 };
    case 'ornamental-celtic':
      return { path: 'M0,5 Q5,0 10,5 Q15,10 20,5 M0,10 Q5,15 10,10 Q15,5 20,10', size: 20 };
    case 'ornamental-art-deco':
      return { path: 'M0,10 L5,0 L10,10 L15,0 L20,10 M0,10 L20,10', size: 20 };
    case 'ornamental-royal':
      return { path: 'M0,8 C3,3 7,3 10,8 C13,13 17,13 20,8 M5,0 L5,3 M15,0 L15,3', size: 20 };
    case 'ornamental-simple-elegant':
      return { path: 'M0,5 L20,5 M5,0 L5,10 M15,0 L15,10', size: 20 };
    case 'ornamental-wave':
      return { path: 'M0,5 C5,0 5,10 10,5 C15,0 15,10 20,5', size: 20 };
    default:
      return { path: 'M0,5 L20,5', size: 20 };
  }
}
